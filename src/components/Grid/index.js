import React       from 'react'
import { connect } from 'react-redux'
/* import styles      from './styles.module.scss' */

export default connect(
  state => state,
)(
  ({ grid, index }) => (
    <div></div>
  )
)
