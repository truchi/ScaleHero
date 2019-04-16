import React  from 'react'
import rcv    from '../../../lib/rcv'
import styles from './styles.module.scss'

const Rect = rcv(<rect />)

const defaults = {
  color : 'transparent',
  radius: 0,
}

export default ({ id, style }) => {
  const cpu = { clipPathUnits: 'objectBoundingBox' }
  style     = { ...defaults, ...style }

  return (
    <>
      <clipPath id={ `${ id }-mask` } clipPath={ `url("#${ id }-shape")` } { ...cpu }>
        <Rect
          className={ styles.mask }
          rcv      ={{ radius: style.radius }}
          x="0" width ="1"
          y="0" height="1"
        />
      </clipPath>
      <Rect
        className={ styles.unit }
        clipPath={ `url("#${ id }-mask")` }
        rcv={ style }
      />
    </>
  )
}
