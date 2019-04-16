import React, {
  useRef,
}from 'react'
import { connect } from 'react-redux'
import {
  getFrom,
  getLayer,
  getNote,
} from '../../../store/selectors'
import { Scale } from '../../../lib/music'
import { Mask  } from '../../../lib/instrument'
import {
  mathMod,
} from 'ramda'
import styles    from './styles.module.scss'
import BoxMask   from '../BoxMask'
import BoxUnit   from '../BoxUnit'

export default connect(
  (state, props) => {
    const { layer, string, box } = props
    const from = getFrom(state)
    const note = getNote(state, props)
    const {
      MAX,
      boxMask,
      layerMasks,
      palette,
      root,
      scale,
    } = getLayer(state, props)

    return {
      MAX,
      id   : `layer-${ layer }-string-${ string }-box-${ box }`,
      mask : boxMask,
      style: Mask.insideAny(string)(from + box)(layerMasks)
        ? palette[Scale.getInterval(root)(note)(scale)] || null
        : null
    }
  }
)(
  ({ MAX, id, mask, style, layer, string, box }) => {
    const indexRef   = useRef(-1)
    const units      = useRef(Array(MAX).fill({})).current
    const hasPrevRef = useRef(false)
    const hasPrev    = hasPrevRef.current
    const prev       = indexRef.current
    indexRef.current = mathMod(indexRef.current + 1, MAX)
    const index      = indexRef.current

    // Syncing radiuses
    const radius     = style ? style.radius : null
    const prevRadius = hasPrev
      ? units[prev].radiuses.radius
      : null
    const syncedRadius = Math.min(
      radius     !== null ? radius     : prevRadius,
      prevRadius !== null ? prevRadius : radius
    )

    // Enter current box
    if (style)
      units[index] = {
        style,
        animate : 'enter',
        radiuses: { radius, enter: syncedRadius }
      }

    // Leave previous box
    if (hasPrev) {
      units[prev].animate = 'leave'
      units[prev].radiuses.leave = syncedRadius
    }

    hasPrevRef.current = !!style

    return (
      <box className={ styles.box }>
        <svg className={ styles.svg }>
          <defs>
            { units.map(({ animate, radiuses }, unit) => (
              <BoxMask
                key     ={ unit }
                id      ={ `${ id }-unit-${ unit }` }
                mask    ={ mask     }
                animate ={ animate  }
                radiuses={ radiuses }
              />
            )) }
          </defs>
          { units.map(({ style }, unit) => (
            <BoxUnit
              key  ={ unit }
              id   ={ `${ id }-unit-${ unit }` }
              style={ style }
            />
          )) }
        </svg>
      </box>
    )
  }
)
