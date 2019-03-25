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
                mask    : layer.boxMask.get(),
                duration: this._duration
              })

              const strings = this._instrument.strings({ masks, cb })

              return { ...layer, strings }
            }
          )
        })
      )
  }
}
