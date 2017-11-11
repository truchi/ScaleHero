;(function() {
let    CHORDS_SCALES = []
let     MODES_SCALES = []
let       ALL_SCALES = []
let            MODES = []
let           CHORDS = []
let CHORDS_AND_MODES = []
let _INIT            = true

class Mujsic {
  static chordsScales() {
    if (_INIT) Mujsic._init()

    return CHORDS_SCALES
  }

  static modesScales() {
    if (_INIT) Mujsic._init()

    return MODES_SCALES
  }

  static allScales() {
    if (_INIT) Mujsic._init()

    return ALL_SCALES
  }

  static modes() {
    if (_INIT) Mujsic._init()

    return MODES
  }

  static chords() {
    if (_INIT) Mujsic._init()

    return CHORDS
  }

  static chordsAndModes() {
    if (_INIT) Mujsic._init()

    return CHORDS_AND_MODES
  }

  static _init() {
    Mujsic._initScales()
    Mujsic._matchInclusions()
  }

  static _initScales() {
    ALL_SCALES =
      window.CHORDS
        .map(chord => Object.assign({}, chord, { type: 'chord' }))
      .concat(
        window.SCALES
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

window.Mujsic = Mujsic
})()
