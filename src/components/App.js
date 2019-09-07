import React       from 'react'
import Player      from './Player'
import InstrumentList from './InstrumentList'
/* import Instrument  from './Instrument' */
import store  from '../store'

const state = store.getState()

export default () => (
  <>
    <Player src={ state.src } states={ state.states } />
    {/* <Instrument /> */}
    <InstrumentList />
  </>
)
