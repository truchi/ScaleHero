import React, {
} from 'react'
import { connect }    from 'react-redux'
import Player         from './Player'
import Audio          from './Audio'
import InstrumentList from './InstrumentList'
import store from '../store'

const state = store.getState()

export default connect(
  null,
  {
    onNext: (payload) => ({ type: 'reduceState', payload }),
    onEnd : ()        => ({ type: 'initState' }),
  }
)(
  ({ src = state.src, bpm = state.bpm, iterator = state.iterator, onNext, onEnd }) => {
    /* onNext = (v) => null//console.log('NEXT', v)
     * onEnd  = ()  => null//console.log('END') */

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
