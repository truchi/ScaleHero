import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react'
import { connect } from 'react-redux'
import Audio       from './Audio'

export default connect(
  state => {
    const { bpm, next: { value, done } } = state
    const time = done ? null : value.time * 60 / bpm

    return { ...state, time }
  },
  {
    onTime   : () => ({ type: 'next'  }),
    onRestart: () => ({ type: 'reset' }),
    onStop   : () => ({ type: 'init'  }),
  }
)(
  ({ src, time, onTime, onRestart, onStop: _onStop }) => {
    const $audio          = useRef()
    const [play, setPlay] = useState(false)

    const onPlay    = useCallback(() => setPlay(true))
    const onPause   = useCallback(() => setPlay(false))
    const onStop    = useCallback(() => ((setPlay(false), _onStop())))

    let id
    const raf = () => id = requestAnimationFrame(
      () => $audio.current.currentTime < time
        ? raf()
        : onTime(time)
    )

    useEffect(() => ((
      time = parseFloat(time),
      play && !isNaN(time) && raf(),
      () => cancelAnimationFrame(id)
    )))

    return (
      <>
        <Audio { ...{
          $audio,
          src,
          play,
          onPlay,
          onPause,
          onRestart,
          onStop,
        } } />
      </>
    )
  }
)
