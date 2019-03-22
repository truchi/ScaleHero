import settable from '../utils/settable'
import { Instrument } from '../lib/instruments'

const get = (object, i, key) =>
  object[i] !== undefined
    ? object[i][key]
    : undefined

const mergeLayers = (prev, layer) => {
  const prevMasks       = prev .instrumentMasks || []
  const layerMasks      = layer.instrumentMasks || []
  const instrumentMasks =
    Array.from(
      Array(Math.max(prevMasks.length, layerMasks.length)),
      (x, i) =>
        layerMasks[i] === null
          ? null
          : {
            position: [ get(layerMasks, i, 'position'), get(prevMasks, i, 'position')].find(v => v !== undefined),
            mask    : [ get(layerMasks, i, 'mask'    ), get(prevMasks, i, 'mask'    )].find(v => v !== undefined)
          }
    )

  return { ...prev, ...layer, instrumentMasks }
}

const DEFAULTS = {
  instrument: new Instrument(),
  layers    : [],
  timeline  : [],
}

export default class Lesson extends settable({ DEFAULTS, after: '_states' }) {
  _instrument
  _layers
  _timeline

  constructor({ instrument, layers, timeline } = {}) {
    super({ instrument, layers, timeline })
  }

  _states() {
    const a = this._timeline
            .reduce(
              (timeline, layers, timelineIndex) => {
                console.log('-----', timelineIndex)

                return timeline.concat({
                  layers: layers.map(
                    (layer, layerIndex) => {
                      layer = mergeLayers(timeline[timelineIndex].layers[layerIndex], layer)
                      const masks = layer.instrumentMasks.filter(mask => mask !== null)

                      const strings = this._instrument.strings({ masks })
                      console.log('->', layerIndex, masks, strings)
                      // TODO finish

                      return layer
                    })
                })
              },
              [{ layers: this._layers }]
            )
            .slice(1)

    console.log(a)
  }
}
