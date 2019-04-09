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
import BoxMask   from '../BoxMask'

export default connect(
  (state, props) => {
    const { string, box } = props
    const from = getFrom(state)
    const note = getNote(state, props)
    const {
      id,
      boxMask,
      layerMasks,
      palette,
      units
    } = getLayer(state, props)

    return {
      id,
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
  ({ id, mask, units, layer, string, box }) => (
    <box className={ styles.box }>
      { console.log(layer, string, box, mask, units) }
        <svg>
          <defs>
            {units.map(({ animate, style }, key) => (
              <BoxMask
                key     ={ key     }
                id      ={ id      }
                mask    ={ mask    }
                animate ={ animate }
                radius  ={ style ? style.radius : 0 }
              />
            ))}
          </defs>
        </svg>
    </box>
  )
)
