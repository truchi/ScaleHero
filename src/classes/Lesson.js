import settable from '../utils/settable'
import { Instrument } from '../lib/instruments'

const DEFAULTS = {
  instrument: new Instrument(),
  duration  : '',
  timeline  : [[]],
}

export default class Lesson extends settable({ DEFAULTS, after: 'states' }) {
  _instrument
  _duration
  _timeline
  _states

  constructor({ instrument, duration, timeline } = {}) {
    super({ instrument, duration, timeline })
  }

  *iterator() {
    yield* this._states.map(({ layers }) => ({ layers: layers.map(({ strings }) => ({ strings })) }))
  }

  [Symbol.iterator]() {
    return this.iterator()
  }

  states() {
    this._states = this._timeline
      .map(
        layers => ({
          layers: layers.map(
            layer => {
              const { palette, scale, instrumentMasks: masks} = layer

              const cb = ({ note, inside }) => ({
                style   : palette.get(inside ? scale.get(layer.root, note) : null).toJSON(),
                mask    : layer.boxMask,
                duration: this._duration
              })

              const strings = this._instrument.strings({ masks, cb })

              return { ...layer, strings }
            }
          )
        })
      )

    this._states.forEach(({ layers }, stateIndex) =>
      layers.forEach(({ strings }, layerIndex) =>
        strings.forEach(({ boxes }, stringIndex) =>
          boxes.forEach((box, boxIndex) => {
            const min = 0
            const max = this._states.length - 1
            const ind = i => Math.max(Math.min(i, max), min)
            const get = i =>
              this._states[ind(i)]
                .layers [layerIndex]
                .strings[stringIndex]
                .boxes  [boxIndex]

            const prev    = get(stateIndex - 1).style.radius
            const current = box                .style.radius
            const next    = get(stateIndex + 1).style.radius

            box.mask = {
              shape: box.mask.shape,
              angle: box.mask.angle,
              enter: box.mask.enter(Math.min(current, prev)),
              leave: box.mask.leave(Math.min(current, next)),
            }
          })
        )
      )
    )
  }
}
