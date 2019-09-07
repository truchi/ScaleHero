import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { connect } from 'react-redux'
/* import styles      from './styles.module.scss' */

export default connect(
  null,
  {
    setState: (payload) => ({ type: 'state', payload }),
  }
)(
  ({ src, states, setState }) => {
    const $audio                  = useRef()
    const $volume                 = useRef()
    const [index    , setIndex  ] = useState(0)
    const [isLooping, setLooping] = useState(true)
    const [isPlaying, setPlaying] = useState(false)
    const [volume   , setVolume ] = useState(1)
    const length                  = states.length

    const set = (index) => ((setIndex(index), setState(states[index].state)))

    const loop    = useCallback(() => setLooping(true ))
    const unloop  = useCallback(() => setLooping(false))
    const play    = useCallback(() => (($audio.current.play ()        , setPlaying(true ))))
    const pause   = useCallback(() => (($audio.current.pause()        , setPlaying(false))))
    const restart = useCallback(() => (($audio.current.currentTime = 0, set(1)           )))
    const stop    = useCallback(() => (($audio.current.pause(),
                                        $audio.current.currentTime = 0,
                                        setPlaying(false),
                                        set(0)
                                      )))
    const vol     = useCallback(() =>
      ((volume = $volume.current.value) => (($audio.current.volume = volume, setVolume(volume))))())

    useEffect(() => {
      if (!isPlaying) return
      play()

      let step, id
      const { time, duration } = states[index]
      const next               = time + duration
      const audio              = $audio.current

      id = requestAnimationFrame(
        step = () =>
          audio.currentTime < next
            ? id = requestAnimationFrame(step)
            : index < length - 1
              ? set(index + 1)
              : isLooping
                ? restart()
                : stop()
      )

      return () => cancelAnimationFrame(id)
    })

    return (
      <>
        <audio src={ src } ref={ $audio } />
        { isPlaying ? (
          <button onClick={ pause }>Pause</button>
        ) : (
          <button onClick={ play }>Play</button>
        )}
        { index !== 0 && (
          <>
            <button onClick={ stop }>Stop</button>
            <button onClick={ restart }>Restart</button>
          </>
        )}
        <br />
        { isLooping ? (
          <button onClick={ unloop }>Unloop</button>
        ) : (
          <button onClick={ loop }>Loop</button>
        )}
        <br />
        <input type="range" min="0" max="1" step="0.01" value={ volume } onChange={ vol } ref={ $volume }/>
      </>
    )
  }
)
