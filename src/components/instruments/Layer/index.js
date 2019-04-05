import React from 'react'
import { connect } from 'react-redux'
import { getStringRange } from '../../../store'
import styles from './styles.module.css'
import String from '../String'
import * as R from 'ramda'

export default connect(
    R.applySpec({
        range: getStringRange
    })
)(
    ({ range, layerIndex }) => (
        <layer className={ styles.layer }>
            {
                R.map(stringIndex => (
                    <String
                        key={ stringIndex }
                        layerIndex={ layerIndex }
                        stringIndex={ stringIndex }
                    />
                ))(range)
            }
        </layer>

    )
)
