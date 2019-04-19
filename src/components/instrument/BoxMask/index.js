import React from 'react'
import { connect } from 'react-redux'
import {
  getDuration,
} from '../../../store/selectors'
import rcv    from '../../../lib/rcv'
import styles from './styles.module.scss'

const G       = rcv(<g />)
const Polygon = rcv(<polygon />)

export default connect(
  state => ({
    duration: getDuration(state)
  })
)(
  ({ duration, unit, layer, mask, animate }) => {
    const id    = type => `layer-${ layer }-unit-${ unit }-${ type }`
    const url   = type => `url("#${ id(type) }")`
    const cpu   = { clipPathUnits: 'objectBoundingBox' }
    const masks = Object.fromEntries(
      ['shape', 'enter', 'leave']
        .map(type => [type, mask[type]])
        .map(([type, mask]) => [type, {
          points: mask.shape,
          rcv   : { width: mask.width + 'px' }
        }])
    )

    const entering = animate === 'enter'
    const leaving  = animate === 'leave'
    const enterCN  = styles.from + (entering || leaving ? ' ' + styles.to : '')
    const leaveCN  = styles.from + (            leaving ? ' ' + styles.to : '')

    return (
      <G rcv={{ duration: duration + 'ms', angle: -mask.angle + 'deg' }}>
        <clipPath id={ id('shape') } clipPath={ url('enter') } { ...cpu }>
          <Polygon
            className={ styles.shape       }
            points   ={ masks.shape.points }
          />
        </clipPath>
        <clipPath id={ id('enter') } clipPath={ url('leave') } { ...cpu }>
          <Polygon
            className={ enterCN        }
            points   ={ masks.enter.points }
            rcv      ={ masks.enter.rcv    }
          />
        </clipPath>
        <clipPath id={ id('leave') } { ...cpu }>
          <Polygon
            className={ leaveCN        }
            points   ={ masks.leave.points }
            rcv      ={ masks.leave.rcv    }
          />
        </clipPath>
      </G>
    )
  }
)
