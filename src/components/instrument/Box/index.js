import React       from 'react'
import { connect } from 'react-redux'
import {
  getFrom,
  getNote,
  getLayer,
} from '../../../store/selectors'
import { Scale } from '../../../lib/music'
import { Mask  } from '../../../lib/instrument'
import styles from './styles.module.css'

export default connect(
  (state, props) => {
    const { string, box } = props
    const from = getFrom(state)
    const note = getNote(state, props)
    const {
      masks,
      palette,
      root,
      scale
    } = getLayer(state, props)

    const interval = Scale.get(root)(note)(scale)
    const inside   = Mask.insideAny(string)(from + box)(masks)
    const style    = inside ? palette[interval] : null

    return { style }
  }
)(
  ({ style, layer, string, box }) => (
    <box className={ styles.box }>
      { console.log(style, layer, string, box) }
    </box>
  )
)
