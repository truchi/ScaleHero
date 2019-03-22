import settable from '../utils/settable'
import { Instrument } from '../lib/instruments'

const DEFAULTS = {
  instrument: new Instrument(),
  timeline  : [[]],
}

export default class Lesson extends settable({ DEFAULTS, after: 'states' }) {
  _instrument
  _timeline
  _states

  constructor({ instrument, timeline } = {}) {
    super({ instrument, timeline })
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
                style: palette.get(inside ? scale.get(layer.root, note) : null),
                mask : layer.boxMask
              })
              const strings = this._instrument.strings({ masks, cb })

              return { ...layer, strings }
            }
          )
        })
      )
  }
}
