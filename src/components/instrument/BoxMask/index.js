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
const Rect    = rcv(<rect />)
const Polygon = rcv(<polygon />)

export default connect(
  state => ({
    duration: getDuration(state)
  })
)(
  ({ duration, id, mask, animate, radius }) => {
    const _id   = type => `${ id }-${ type }`
    const url   = type => `url("#${ _id(type) }")`
    const masks = ['shape', 'enter','leave'].map(type => mask[type](0)) // FIXME
    const cpu   = { clipPathUnits: 'objectBoundingBox' }

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
        setTimeout(
          () => $enter.classList.remove(styles.to),
          duration
        )
      }
    })

    return (
      <G rcv={{ duration: duration + 'ms', angle: mask.angle + 'deg' }}>
        <clipPath id={ _id('mask') } clipPath={ url('shape') } { ...cpu }>
          <Rect
            className={ styles.mask }
            rcv      ={{ radius }}
            x="0" width ="1"
            y="0" height="1"
          />
        </clipPath>
        <clipPath id={ _id('shape') } clipPath={ url('enter') } { ...cpu }>
          <Polygon
            className={ styles.shape   }
            points   ={ masks[0].shape }
          />
        </clipPath>
        <clipPath id={ _id('enter') } clipPath={ url('leave') } { ...cpu }>
          <Polygon
            className={ styles.from    }
            points   ={ masks[1].shape }
            rcv      ={{ width: `${ masks[1].width }px` }}
            ref      ={ $enter }
          />
        </clipPath>
        <clipPath id={ _id('leave') } { ...cpu }>
          <Polygon
            className={ styles.from    }
            points   ={ masks[2].shape }
            rcv      ={{ width: `${ masks[2].width }px` }}
            ref      ={ $leave }
          />
        </clipPath>
      </G>
    )
  }
)
