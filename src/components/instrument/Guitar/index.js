import React       from 'react'
import { connect } from 'react-redux'
import styles from './styles.module.scss'
import {
  Note,
  Scale,
} from '../../../lib/music'
import Mask     from '../../../lib/mask'
import textures from '../../../lib/textures'
import {
  __,
  evolve,
  map,
  nth,
  range,
  reverse,
} from 'ramda'

const getTuning = ({ tuning    }) => reverse(tuning)
const getBoxes  = ({ from, to  }) => range(from, to + 1)
const getLayer  =
  ({ layers, clipPaths, layerMasks, palettes, scales }) =>
    layer =>
      evolve({
        clipPath  : nth(__, clipPaths),
        layerMasks: map(nth(__, layerMasks)),
        palette   : nth(__, palettes),
        scale     : nth(__, scales),
      },
        layer
      )
const getStyle = ({ palette, open, root, scale, string, box, from, layerMasks }) =>
  Mask.insideAny(string)(from + box)(layerMasks)
    ? palette[Scale.getInterval(root) (Note.add(box) (open)) (scale)] || null
    : null

const defaultBox = {
  clipPath       : null,
  backgroundColor: 'transparent',
  backgroundImage: null,
  borderRadius   : 0,
  borderColor    : 'transparent',
  borderStyle    : 'solid',
  borderWidth    : 0
}

const Box = ({ clipPath, style }) => {
  style = evolve({
    backgroundImage: _ => _ != null
      ? `url("data:image/svg+xml,${ encodeURI(textures(_).toString()) }")`
      : null
  })({ ...defaultBox, ...style, clipPath })

  return (
    <box
      className={ styles.box }
      style={ style }
    />
  )
}

export default connect(
  state => {
    let { layers, from } = state
    const tuning         = getTuning(state)
    const boxes          = getBoxes (state)

    return {
      layers: layers
        .map(getLayer(state))
        .map(({ clipPath, layerMasks, palette, root, scale }) =>
          tuning.map((open, string) =>
            boxes.map(box => ({
                clipPath,
                style: getStyle({ palette, open, root, scale, string, box, from, layerMasks })
              })
            )
          )
        )
    }
  }
)(
  ({ layers }) => (
    <guitar className={ styles.guitar }>
      { layers.map((string, key) => (
        <layer className={ styles.layer } key={ key }>
          { string.map((boxes, key) => (
            <string className={ styles.string } key={ key }>
              { boxes.map(({ clipPath, style }, key) => (
                <Box key={ key } clipPath={ clipPath } style={ style } />
              )) }
            </string>
          )) }
        </layer>
      )) }
    </guitar>
  )
)
