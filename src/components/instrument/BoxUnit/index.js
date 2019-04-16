import React  from 'react'
import styles from './styles.module.scss'

const defaults = {
  color : 'transparent',
  radius: 0,
}

export default ({ id, style }) => {
  style     = { ...defaults, ...style }
  const r1  = style.radius
  const rpc = r1 * 100 + '%'
  const cpu = { clipPathUnits: 'objectBoundingBox' }

  return (
    <>
      <clipPath id={ `${ id }-mask` } clipPath={ `url("#${ id }-shape")` } { ...cpu }>
        <rect
          rx   ={ r1 } ry    ={ r1 }
          x    ="0"    y     ="0"
          width="1"    height="1"

        />
      </clipPath>
      <rect
        className ={ styles.unit }
        clipPath  ={ `url("#${ id }-mask")` }
        fill      ={ style.color }
        rx ={ rpc } ry={ rpc }
      />
    </>
  )
}
