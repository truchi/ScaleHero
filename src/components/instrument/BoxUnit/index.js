import React  from 'react'
import styles from './styles.module.scss'

const defaults = {
  color : 'transparent',
  radius: 0,
}

export default ({ unit, box, string, layer, style }) => {
  style     = { ...defaults, ...style }
  const r1  = style.radius
  const rpc = r1 * 100 + '%'
  const cpu = { clipPathUnits: 'objectBoundingBox' }

  const idU  = type => `layer-${ layer }-string-${ string }-box-${ box }-unit-${ unit }-${ type }`
  const idM  = type => `layer-${ layer }-unit-${ unit }-${ type }`
  const urlU = type => `url("#${ idU(type) }")`
  const urlM = type => `url("#${ idM(type) }")`

  return (
    <>
      <clipPath id={ idU('mask') } clipPath={ urlM('shape') } { ...cpu }>
        <rect
          rx   ={ r1 } ry    ={ r1 }
          x    ="0"    y     ="0"
          width="1"    height="1"

        />
      </clipPath>
      <rect
        className ={ styles.unit }
        clipPath  ={ urlU('mask') }
        fill      ={ style.color }
        rx ={ rpc } ry={ rpc }
      />
    </>
  )
}
