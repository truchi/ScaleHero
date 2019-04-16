import React, {
  useEffect,
  useRef,
} from 'react'
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

    let $enter = useRef(null)
    let $leave = useRef(null)
    useEffect(() => {
      $enter = $enter.current.$
      $leave = $leave.current.$

      if (animate === 'enter') {
        $leave.classList.remove(styles.to)
        $enter.classList.add   (styles.to)
      }

      if (animate === 'leave') {
        $leave.classList.add(styles.to)
        setTimeout(() => $enter.classList.remove(styles.to), duration)
      }
    })

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
            className={ styles.from        }
            points   ={ masks.enter.points }
            rcv      ={ masks.enter.rcv    }
            ref      ={ $enter             }
          />
        </clipPath>
        <clipPath id={ id('leave') } { ...cpu }>
          <Polygon
            className={ styles.from        }
            points   ={ masks.leave.points }
            rcv      ={ masks.leave.rcv    }
            ref      ={ $leave             }
          />
        </clipPath>
      </G>
    )
  }
)
