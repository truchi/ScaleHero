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

              const cb = ({ note, inside }) => {
                note = scale.get(layer.root, note)

                return {
                  empty   : !inside || !note,
                  style   : palette.get(inside ? note : null).toJSON(),
                  mask    : layer.boxMask,
                  duration: this._duration
                }
              }

              const strings = this._instrument.strings({ masks, cb })

              return { ...layer, strings }
            }
          )
        })
      )

    Array
      .from(this._boxIterator())
      .forEach(({ stateIndex, layerIndex, stringIndex, boxIndex, box }) => {
        const min = 0
        const max = this._states.length - 1
        const ind = i => Math.max(Math.min(i, max), min)
        const get = i => this
          ._states[ind(i)]
          .layers[layerIndex]
          .strings[stringIndex]
          .boxes[boxIndex]

        const radius = box.style.radius
        const { empty: prevEmpty, style: { radius: prevRadius } } = get(stateIndex - 1)
        const { empty: nextEmpty, style: { radius: nextRadius } } = get(stateIndex + 1)

        const enter = prevEmpty ? radius : Math.min(radius, prevRadius)
        const leave = nextEmpty ? radius : Math.min(radius, nextRadius)

        box.mask = {
          shape: box.mask.shape,
          angle: box.mask.angle,
          enter: box.mask.enter(enter),
          leave: box.mask.leave(leave),
        }
      })
  }

  *_boxIterator() {
    yield* this._states.map(
      ({ layers }, stateIndex) =>
        layers.map(
          ({ strings }, layerIndex) =>
            strings.map(
              ({ boxes }, stringIndex) =>
                boxes.map(
                  (box, boxIndex) => ({
                    stateIndex,
                    layerIndex,
                    stringIndex,
                    boxIndex,
                    box
                  })
              ).flat()
            ).flat()
        ).flat()
    ).flat()
  }
}
