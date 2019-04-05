import React from 'react'
import { connect } from 'react-redux'
import { getNote, getLayer } from '../../../store'
import styles from './styles.module.css'

export default connect(
  (state, props) => {
    const note  = getNote (state, props)
    const layer = getLayer(state, props)

    return { note, root: layer.root }
  }
)(
  ({ note, layerIndex, stringIndex, boxIndex, root }) => (
    <box className={ styles.box }>
      { console.log(root, note, layerIndex, stringIndex, boxIndex) }
    </box>
  )
)
