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

const renderData = (id, mask, radius, duration)=> {
  const angle  = mask.angle
  const getId  = type => type ? `${ id }-${ type }` : null
  const getUrl = id   => id   ? `url("#${ id }")`   : null
  const clip  = Object.fromEntries(
    [['shape', 'enter'], ['enter', 'leave']]
      .map(([o, clip]) => [o, getUrl(getId(clip))])
  )

  const g = {
    rcv: {
      angle: `${ -angle }deg`,
      duration
    }
  }

  const maskData = {
    clipPath: {
      id           : getId('mask'),
      clipPath     : getUrl(getId('shape')),
      clipPathUnits: 'objectBoundingBox'
    },
    rect: {
      className: styles.ellipse,
      x     : '0',
      y     : '0',
      width : '1',
      height: '1',
      rcv   : { radius }
    }
  }

  const data = ['shape', 'enter', 'leave']
    // FIXME radius should be prev/next radius...
    .map(key => [key, mask[key](0)])
    .map(([key, mask]) => ({
      clipPath: {
        key,
        id           : getId(key),
        clipPath     : clip[key],
        clipPathUnits: 'objectBoundingBox'
      },
      polygon: {
        className: styles[key],
        points   : mask.shape.toString(),
        rcv      : mask.width
          ? { width: `${ mask.width }px` }
          : {}
      },
    }))

  return { g, mask: maskData, data }
}

export default connect(
  (state, props) => {
    return { duration: getDuration(state) }
  }
)(
  ({ duration, id, mask, animate, radius }) => {
    const _id   = type => `${ id }-${ type }`
    const url   = type => `url("#${ _id(type) }")`
    const angle = mask.angle
    const masks = ['shape', 'enter','leave'].map(type => mask[type](0)) // FIXME
    const cpu   =
      { clipPathUnits: 'objectBoundingBox' }

    return (
      <G rcv={{ duration, angle }}>
        <clippath id={ _id('mask') } clipPath={ url('shape') } { ...cpu }>
          <Rect
            className={ styles.mask }
            rcv      ={{ radius }}
            x="0" width ="1"
            y="0" height="1"
          />
        </clippath>
        <clippath id={ _id('shape') } clipPath={ url('enter') } { ...cpu }>
          <Polygon
            className={ styles.shape   }
            points   ={ masks[0].shape }
          />
        </clippath>
        <clippath id={ _id('shape') } clipPath={ url('leave') } { ...cpu }>
          <Polygon
            className={ styles.enter   }
            points   ={ masks[1].shape }
            rcv      ={{ width: `${ mask.enter.width }px` }}
          />
        </clippath>
        <clippath id={ _id('leave') } { ...cpu }>
          <Polygon
            className={ styles.leave   }
            points   ={ masks[2].shape }
            rcv      ={{ width: `${ mask.leave.width }px` }}
          />
        </clippath>
      </G>
    )
  }
)
