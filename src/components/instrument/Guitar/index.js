import React       from 'react'
import { connect } from 'react-redux'
import styles from './styles.module.scss'
import {
  Note,
  Scale,
} from '../../../lib/music'
import Mask from '../../../lib/mask'
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
      }, layer)

export default connect(
  state => {
    const { layers, from } = state
    const tuning           = getTuning(state)
    const boxes            = getBoxes (state)

    return {
      layers: layers
        .map(getLayer(state))
        .map(({ clipPath, layerMasks, palette, root, scale }) =>
          tuning.map((open, string) =>
            boxes.map(box => {
              if (!Mask.insideAny(string)(from + box)(layerMasks)) return {}

              const note  = Note.add(box)(open)
              const style = palette[Scale.getInterval(root)(note)(scale)]

              return style ? { clipPath, ...style } : {}
            })
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
              { boxes.map((style, key) => (
                <box key={ key } className={ styles.box } style={ style } />
              )) }
            </string>
          )) }
        </layer>
      )) }
    </guitar>
  )
)
