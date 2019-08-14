import React       from 'react'
import { connect } from 'react-redux'
/* import styles      from './styles.module.scss' */

export default connect(
  state => {
    const { grid } = state

    return { grid }
  }
)(
  ({ grid }) => (
    <>
    </>
  )
)
