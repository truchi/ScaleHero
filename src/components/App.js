import React, {
} from 'react'
import { connect }    from 'react-redux'
import Player         from './Player'
import Grid           from './Grid'
import InstrumentList from './InstrumentList'

export default connect()(
  () => {
    return (
      <>
        <Player />
        <Grid />
        <InstrumentList />
      </>
    )
  }
)
