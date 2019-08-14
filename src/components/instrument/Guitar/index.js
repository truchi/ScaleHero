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
  merge,
  nth,
  range,
  reverse,
} from 'ramda'

const getTuning = ({ tuning   }) => reverse(tuning)
const getBoxes  = ({ from, to }) => range(from, to + 1)
const getLayer  =
  ({ layers, clipPaths, masks, palettes, scales }) =>
    layer =>
      merge({
        clipPaths: [null],
      }, evolve({
          clipPaths: map(nth(__, clipPaths)),
          masks    : map(nth(__, masks)),
          palette  : nth(__, palettes),
          scale    : nth(__, scales),
        }, layer)
      )

export default connect(
  state => {
    state = { ...state, ...state.instruments[0] } // FIXME hack
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
        .map(({ clipPaths, masks, palette, root, scale }) =>
          tuning.map((open, string) =>
            boxes.map(box =>
              !Mask.insideAny(string)(from + box)(masks)
                ? { clipPaths: [] }
                : {
                  clipPaths,
                  style: palette[Scale.getInterval(root)(Note.add(box)(open))(scale)] || {}
                }
            )
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
              { boxes.map(({ clipPaths, style }, key) => (
                <boxes className={ styles.boxes } key={ key }>
                  { clipPaths.map((clipPath, key) => (
                    <box key={ key } className={ styles.box } style={{ clipPath, ...style }} />
                  )) }
                </boxes>
              )) }
            </string>
          )) }
        </layer>
      )) }
    </instrument>
  )
)
