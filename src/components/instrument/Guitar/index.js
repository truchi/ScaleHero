import React       from 'react'
import { connect } from 'react-redux'
import styles from './styles.module.scss'
import {
  Note,
  Scale,
} from '../../../lib/music'
import {
  Mask,
} from '../../../lib/instrument'
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
  ({ layers, boxMasks, layerMasks, palettes, scales }) =>
    layer =>
      evolve({
        boxMask   : nth(__, boxMasks),
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

const defaultStyle = {
  backgroundColor: 'transparent',
  backgroundImage: null,
  borderRadius   : 0,
  borderColor    : 'transparent',
  borderStyle    : 'solid',
  borderWidth    : 0
}
const Box = ({ style }) => {
  let {
    backgroundColor,
    backgroundImage,
    borderRadius,
    borderColor,
    borderStyle,
    borderWidth,
  } = { ...defaultStyle, ...style }

  borderRadius = borderRadius * 50 + '%'
  borderWidth  = borderWidth + 'px'

  if (backgroundImage != null) {
    backgroundImage = textures(backgroundImage).toString()
    backgroundImage = `url("data:image/svg+xml,${ encodeURI(backgroundImage) }")`
  }

  return (
    <box
      className={ styles.box }
      style={{
        backgroundColor,
        backgroundImage,
        borderRadius,
        borderColor,
        borderStyle,
        borderWidth,
      }}
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
        .map(({ layerMasks, palette, root, scale }) =>
          tuning.map((open, string) =>
            boxes.map(box =>
              getStyle({ palette, open, root, scale, string, box, from, layerMasks }))))
    }
  }
)(
  ({ layers }) => (
    <guitar className={ styles.guitar }>
      { layers.map((string, key) => (
        <layer className={ styles.layer } key={ key }>
          { string.map((boxes, key) => (
            <string className={ styles.string } key={ key }>
              { boxes.map((style, key) => (
                <Box key={ key } style={ style } />
              )) }
            </string>
          )) }
        </layer>
      )) }
    </guitar>
  )
)
