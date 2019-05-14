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
  ({ layers, clipPaths, masks, palettes, scales }) =>
    layer =>
      evolve({
        clipPath: nth(__, clipPaths),
        masks   : map(nth(__, masks)),
        palette : nth(__, palettes),
        scale   : nth(__, scales),
      }, layer)

export default connect(
  state => {
    const {
      instrument,
      from,
      layers,
    } = state
    const tuning = getTuning(state)
    const boxes  = getBoxes (state)

    return {
      instrument,
      open  : instrument === 'guitar' && !from,
      layers: layers
        .map(getLayer(state))
        .map(({ clipPath, masks, palette, root, scale }) =>
          tuning.map((open, string) =>
            boxes.map(box => {
              if (masks && !Mask.insideAny(string)(from + box)(masks)) return {}

              const note  = Note.add(box)(open)
              const style = palette[Scale.getInterval(root)(note)(scale)]

              return style ? { clipPath, ...style } : {}
            })
          )
        )
    }
  }
)(
  ({ instrument, open, layers }) => (
    <instrument className={ [styles[instrument], open ? styles.open : ''].join(' ') }>
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
    </instrument>
  )
)
