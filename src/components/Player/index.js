import React, {
  useCallback,
  useState,
  cloneElement,
  useRef,
  useEffect,
} from 'react'

const useForceUpdate = () => (([bool, update] = useState()) => () => update(!bool))()

export default ({ audio, bpm, iterator, onNext, onEnd }) => {
  const $audio          = useRef()
  const [play, setPlay] = useState(false)
  const forceUpdate     = useForceUpdate()

  const onPlay    = useCallback(() => setPlay(true))
  const onPause   = useCallback(() => setPlay(false))
  const onRestart = useCallback(() => ((iterator.reset(), forceUpdate())))
  const onStop    = useCallback(() => ((iterator.reset(), onEnd(), setPlay(false))))

  const next = () =>
    (({ value, done } = iterator.next()) =>
      done
        ? { done: true }
        : {
          value,
          time: value.time * 60 / bpm
        }
    )()

  const step = ({ done, value, time }) => () =>
    (({ currentTime } = $audio.current) =>
      currentTime < time
        ? raf({ done, value, time })
        : (( raf(next()), onNext(value) ))
    )()

  let id
  const raf = (_next) => _next.done || (id = requestAnimationFrame(step(_next)))

  useEffect(() => ((
    play && raf(next()),
    () => cancelAnimationFrame(id)
  )))

  return (
    <>
      { cloneElement(audio, {
        $audio,
        play,
        onPlay,
        onPause,
        onRestart,
        onStop,
      }) }
    </>
  )
}
