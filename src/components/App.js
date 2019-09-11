import React, {
} from 'react'
import { connect }    from 'react-redux'
import Player         from './Player'
import Audio          from './Audio'
import InstrumentList from './InstrumentList'

export default connect(
  state => state,
  {
    onNext: (payload) => ({ type: 'nextState', payload }),
    onEnd : ()        => ({ type: 'initState' }),
  }
)(
  ({ src, bpm, iterator, onNext, onEnd }) => {
    onNext = (v) => console.log('NEXT', v)
    onEnd  = () => console.log('END')

    const playerProps = {
      audio: (<Audio src={ src } />),
      bpm,
      iterator,
      onNext,
      onEnd,
    }

    return (
      <>
        <Player { ...playerProps } />
        <InstrumentList />
      </>
    )
  }
)
