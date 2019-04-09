import React       from 'react'
import { connect } from 'react-redux'
import {
  getFrom,
  getLayer,
  getNote,
} from '../../../store/selectors'
import { Scale } from '../../../lib/music'
import { Mask  } from '../../../lib/instrument'
import styles    from './styles.module.scss'

export default connect(
  (state, props) => {
    const { string, box } = props
    const from = getFrom(state)
    const note = getNote(state, props)
    const {
      boxMask,
      layerMasks,
      palette,
      units
    } = getLayer(state, props)

    return {
      mask : boxMask,
      units: units.map(({ root, scale, animate }) => ({
        animate,
        style: Mask.insideAny(string)(from + box)(layerMasks)
          ? palette[Scale.getInterval(root)(note)(scale)]
          : null
      }))
    }
  }
)(
  ({ mask, units, layer, string, box }) => (
    <box className={ styles.box }>
      { console.log(layer, string, box, mask, units) }
    </box>
  )
)
