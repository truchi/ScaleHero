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
    range(from, to + 1)

export const getFrom =
  ({ from }) =>
    from

export const getDuration =
  ({ duration }) =>
    duration

export const getNote =
  ({ tuning }, { string, box }) =>
    Note.add(box)(tuning[tuning.length - 1 - string])

export const getLayer =
  ({ layers, boxMasks, layerMasks, palettes, scales }, { layer }) =>
    evolve(
      {
        boxMask   : nth(__, boxMasks),
        layerMasks: map(nth(__, layerMasks)),
        palette   : nth(__, palettes),
        units     : map(evolve({ scale: nth(__, scales) }))
      },
      layers[layer]
    )
