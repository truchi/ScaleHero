const SOUNDS = (() => {
  const $sounds = document.getElementById('sounds')

  return [0, 1, 2, 3, 4, 5, 6, 7]
    .map(octave => {
      let sounds = $sounds.querySelector(`[octave="${octave}"]`)

      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        .map(semi => sounds && sounds.querySelector(`[semi="${semi}"]`))
    })
})()

class IntervalPlayer {
  constructor(opts) {
    this.speed = opts.speed || 'slow'
    this.type  = opts.type  || 'both'
  }

  play(root, intv) {
    this.stop()

    setTimeout(() => {
      SOUNDS[4][root.semi].play()
      SOUNDS[4][intv.semi].play()
    })
  }

  stop() {
    SOUNDS.forEach(octave => octave.forEach(sound => {
      if (sound) {
        sound.pause()
        sound.currentTime = 0
      }
    }))
  }
}

export default IntervalPlayer
