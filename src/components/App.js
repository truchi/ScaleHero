import React, {
} from 'react'
import { connect }    from 'react-redux'
import Player         from './Player'
import InstrumentList from './InstrumentList'

export default connect()(
  () => {
    return (
      <>
        <Player />
        <InstrumentList />
      </>
    )
  }
)
