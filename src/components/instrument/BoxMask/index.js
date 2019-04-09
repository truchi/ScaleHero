import React  from 'react'
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
  (state, props) => {
    return { duration: getDuration(state) }
  }
)(
  ({ duration, id, mask, animate, radius }) => {
    duration    = duration + 'ms'
    const _id   = type => `${ id }-${ type }`
    const url   = type => `url("#${ _id(type) }")`
    const angle = mask.angle + 'deg'
    const masks = ['shape', 'enter','leave'].map(type => mask[type](0)) // FIXME
    const cpu   =
      { clipPathUnits: 'objectBoundingBox' }

    return (
      <G rcv={{ duration, angle }}>
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
            className={ styles.enter   }
            points   ={ masks[1].shape }
            rcv      ={{ width: `${ masks[1].width }px` }}
          />
        </clipPath>
        <clipPath id={ _id('leave') } { ...cpu }>
          <Polygon
            className={ styles.leave   }
            points   ={ masks[2].shape }
            rcv      ={{ width: `${ masks[2].width }px` }}
          />
        </clipPath>
      </G>
    )
  }
)
