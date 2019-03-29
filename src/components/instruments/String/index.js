import React from 'react'
import { connect } from 'react-redux'
import { getBoxRange } from '../../../store'
import styles from './styles.module.css'
import Box from '../Box'
import * as R from 'ramda'

export default connect(
    R.compose(
        R.objOf('range'),
        getBoxRange
    )
)(
    ({ range, layerIndex, stringIndex }) => (
        <string className={ styles.string }>
            {
                R.map(boxIndex => (
                    <Box
                        key={ boxIndex }
                        layerIndex={ layerIndex }
                        stringIndex={ stringIndex }
                        boxIndex={ boxIndex }
                    />
                ))(range)
            }
        </string>
    )
)
