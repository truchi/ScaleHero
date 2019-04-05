import React from 'react'
import { connect } from 'react-redux'
import { getLayerRange } from '../../../store'
import styles from './styles.module.css'
import Layer from '../Layer'
import * as R from 'ramda'

export default connect(
    R.applySpec({
        range: getLayerRange
    })
)(
    ({ range }) => (
        <guitar>
            {
                R.map(layerIndex => (
                    <Layer
                        key={ layerIndex }
                        className={ styles.guitar }
                        layerIndex={ layerIndex }
                    />
                ))(range)
            }
        </guitar>
    )
)
