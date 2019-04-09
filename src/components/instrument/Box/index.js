import React       from 'react'
import { connect } from 'react-redux'
import {
  getFrom,
  getLayer,
  getNote,
  getScale,
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
      masks,
      palette,
      units
    } = getLayer(state, props)

    return {
      units: units.map(({ root, scale, animate }) => {
        scale = getScale(state, scale)

        return {
          animate,
          style: Mask.insideAny(string)(from + box)(masks)
            ? palette[Scale.getInterval(root)(note)(scale)]
            : null
        }
      })
    }
  }
)(
  ({ units, layer, string, box }) => (
    <box className={ styles.box }>
      { console.log(layer, string, box, units) }
    </box>
  )
)
