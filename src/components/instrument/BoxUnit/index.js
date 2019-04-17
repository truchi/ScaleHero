import React  from 'react'
import styles from './styles.module.scss'
import Textures from '../../../lib/textures'

const defaults = {
  fill  : 'transparent',
  radius: 0,
}

export default ({ unit, box, string, layer, style }) => {
  style = { ...defaults, ...style }

  let texture
  const r1  = style.radius
  const rpc = r1 * 100 + '%'
  const cpu = { clipPathUnits: 'objectBoundingBox' }

  const idU  = type => `layer-${ layer }-string-${ string }-box-${ box }-unit-${ unit }-${ type }`
  const idM  = type => `layer-${ layer }-unit-${ unit }-${ type }`
  const urlU = type => `url("#${ idU(type) }")`
  const urlM = type => `url("#${ idM(type) }")`

  if (typeof style.fill === 'object') {
    texture = (<Textures id={ idU('texture') } { ...style.fill } />)
    style.fill = urlU('texture')
  }

  return (
    <>
      { texture && texture }
      <Textures id={ idU('texture') } type="circles" />
      <clipPath id={ idU('mask') } clipPath={ urlM('shape') } { ...cpu }>
        <rect
          rx   ={ r1 } ry    ={ r1 }
          x    ="0"    y     ="0"
          width="1"    height="1"

        />
      </clipPath>
      <rect
        className={ styles.unit }
        clipPath ={ urlU('mask') }
        fill     ={ style.fill }
        rx ={ rpc } ry={ rpc }
      />
    </>
  )
}
