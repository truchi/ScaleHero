import React, {
  useCallback as cb,
  useEffect,
  useRef,
  useState,
} from 'react'
/* import styles      from './styles.module.scss' */

export default ({
  src,
  $audio    = useRef(),
  $volume   = useRef(),
  play      = false,
  loop      = true,
  volume    = 1,
  onPlay    = () => null,
  onPause   = () => null,
  onRestart = () => null,
  onStop    = () => null,
  onLoop    = () => null,
  onUnloop  = () => null,
  onVolume  = () => null,
}) => {
  const [_play, setPlay] = useState(play)
  const [_loop, setLoop] = useState(loop)
  const [_volume, setVolume] = useState(volume)
  const [_stopped, setStopped] = useState(!play)

  const __play    =  ()       => (( $audio.current.play()           ))
  const __pause   =  ()       => (( $audio.current.pause()          ))
  const __restart =  ()       => (( $audio.current.currentTime = 0  ))
  const __stop    =  ()       => (( __pause(), __restart()          ))
  const __loop    =  ()       => (( $audio.current.loop    = true   ))
  const __unloop  =  ()       => (( $audio.current.loop    = false  ))
  const __volume  =  (volume) => (( $volume.current.volume = volume ))

  const handlePlay    = cb((e) => (( __play   (), setPlay(true), setStopped(false), onPlay   (e) )))
  const handlePause   = cb((e) => (( __pause  (), setPlay(false)                  , onPause  (e) )))
  const handleRestart = cb((e) => (( __restart(), setStopped(!play)               , onRestart(e) )))
  const handleStop    = cb((e) => (( __stop   (), setPlay(false), setStopped(true), onStop   (e) )))
  const handleLoop    = cb((e) => (( __loop   (), setLoop(true)                   , onLoop   (e) )))
  const handleUnloop  = cb((e) => (( __unloop (), setLoop(false)                  , onUnloop (e) )))
  const handleVolume  = cb((e) => ((v = e.target.value) =>
                                  (( __volume(v), setVolume(v)                    , onVolume (e) )))())

  const handleEnd = (e) => _loop ? handleRestart() : handleStop()

  useEffect(($ = $audio.current) => ((
    _play ? $.play() : $.pause(),
    $.volume = _volume,
    $.addEventListener('ended', handleEnd),
    () => $.removeEventListener('ended', handleEnd)
  )))

  return (
    <>
      <audio src={ src } ref={ $audio } />
      <div>
        { _play ? (
          <button onClick={ handlePause }>Pause</button>
        ) : (
          <button onClick={ handlePlay }>Play</button>
        )}
        { _stopped || (
          <>
            <button onClick={ handleStop    }>Stop</button>
            <button onClick={ handleRestart }>Restart</button>
          </>
        ) }
      </div>
      <div>
        { _loop ? (
          <button onClick={ handleUnloop }>Unloop</button>
        ) : (
          <button onClick={ handleLoop }>Loop</button>
        )}
      </div>
      <div>
        <input
          type="range" min="0" max="1" step="0.01"
          value   ={ _volume      }
          onChange={ handleVolume }
          ref     ={ $volume      }
        />
      </div>
    </>
  )
}
