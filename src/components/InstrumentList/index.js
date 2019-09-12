import React       from 'react'
import { connect } from 'react-redux'
import Instrument  from '../Instrument'
import toArray from './toArray'
// import styles from './styles.module.scss'
import {
  evolve,
  map,
} from 'ramda'

export default connect(
  (state) =>
    evolve({
      instruments: map(toArray(state))
    })(state)
)(
  ({ instruments }) => (
    <>
      { instruments.map((instrument, key) =>
        <Instrument key={ key } { ...instrument } />
      )}
    </>
  )
)
