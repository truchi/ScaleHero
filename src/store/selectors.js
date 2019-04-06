import {
  Note,
} from '../lib/music'
import {
  __,
  evolve,
  map,
  nth,
  range,
} from 'ramda'

export const getLayerRange =
  ({ layers }) =>
    range(0, layers.length)

export const getStringRange =
  ({ tuning }) =>
    range(0, tuning.length)

export const getBoxRange =
  ({ from, to }) =>
    range(from, to)

export const getFrom =
  ({ from }) =>
    from

export const getNote =
  ({ tuning }, { string, box }) =>
    Note.add(box)(tuning[string])

export const getLayer =
  ({ layers, masks, palettes, scales }, { layer }) =>
    evolve(
      {
        masks  : map(nth(__, masks)),
        palette: nth(__, palettes),
        scale  : nth(__, scales  ),
      },
      layers[layer]
    )
