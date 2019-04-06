import React       from 'react'
import { connect } from 'react-redux'
import {
  getLayerRange,
} from '../../../store'
import styles from './styles.module.css'
import Layer  from '../Layer'
import {
  applySpec,
  map,
} from 'ramda'

export default connect(
  applySpec({
    range: getLayerRange,
  })
)(
  ({ range }) => (
    <guitar className={ styles.guitar }>
      { map(i => (
        <Layer
          key  ={ i }
          layer={ i }
        />
      ))(range) }
    </guitar>
  )
)
