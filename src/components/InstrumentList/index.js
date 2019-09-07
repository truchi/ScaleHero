import React       from 'react'
import { connect } from 'react-redux'
import Instrument  from '../Instrument'
import toArray from './toArray'
// import styles from './styles.module.scss'
import {
  compose as c,
  map,
  objOf,
  prop,
} from 'ramda'

export default connect(
  (state) =>
    c(
      objOf('instruments'),
      map(toArray(state)),
      prop('state'),
    )(state)
)(
  ({ instruments }) => (
    <>
      { instruments.map((instrument, key) =>
        <Instrument key={ key } { ...instrument } />
      )}
    </>
  )
)
