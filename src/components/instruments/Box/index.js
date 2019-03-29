import React from 'react'
import { connect } from 'react-redux'
import { getBoxNote } from '../../../store'
import styles from './styles.module.css'
import * as R from 'ramda'

export default connect(
    R.compose(
        R.objOf('note'),
        getBoxNote
    )
)(
    ({ note, layerIndex, stringIndex, boxIndex }) => (
        <box className={ styles.box }>
            { console.log(note, layerIndex, stringIndex, boxIndex) }
        </box>
    )
)
