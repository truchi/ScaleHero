import Interval from './Interval'
import Scale    from './Scale'
import Mode     from './Mode'

let    CHORDS_SCALES = []
let     MODES_SCALES = []
let       ALL_SCALES = []
let            MODES = []
let           CHORDS = []
let CHORDS_AND_MODES = []

class Mujsic {
  static init(chords, scales) {
    Mujsic._initScales(chords, scales)
    Mujsic._matchInclusions()

    return Mujsic
  }

  static chordsScales()   { return CHORDS_SCALES    }
  static modesScales()    { return MODES_SCALES     }
  static allScales()      { return ALL_SCALES       }
  static modes()          { return MODES            }
  static chords()         { return CHORDS           }
  static chordsAndModes() { return CHORDS_AND_MODES }

  static _initScales(chords, scales) {
    ALL_SCALES =
      chords
        .map(chord => Object.assign({}, chord, { type: 'chord' }))
      .concat(
        scales
          .map(scale => Object.assign({}, scale, { type: 'mode' }))
      )
      .map(scale => {
        let name       = scale.name
        let type       = scale.type
        let scaleModes = scale.modes

        scale      = new Scale(Interval.fromNamesString(scale.intervals))
        scale.name = name

        if (type === 'chord') CHORDS_SCALES.push(scale)
        else                   MODES_SCALES.push(scale)

        scale.modes = scaleModes.map(mode => {
          let name = mode.name

          mode       = new Mode(Interval.fromNamesString(mode.intervals))
          mode.name  = name
          mode.type  = type
          mode.scale = scale

          if (type === 'chord') CHORDS.push(mode)
          else                  MODES .push(mode)
          CHORDS_AND_MODES.push(mode)

          return mode
        })

        return scale
      })
  }

  static _matchInclusions() {
    let found = []

    CHORDS_AND_MODES.forEach((mode1, i) => {
      found[i] = found[i] || []

      CHORDS_AND_MODES.forEach((mode2, j) => {
        if (i === j) return

        found[j] = found[j] || []
        if (found[j].includes(i)) return

        if (mode1.doIncludes(mode2)) {
          found[i].push(j)

          mode1.includes  .push(mode2)
          mode2.includedIn.push(mode1)
        }
      })
    })
  }
}

export default Mujsic
