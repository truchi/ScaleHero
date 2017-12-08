import { randomInt } from './utils'

const DURATION = 2000
const SOUNDS   = Array.from(
  document.getElementById('sounds').querySelectorAll('audio')
)

class IntervalPlayer {
  constructor(opts) {
    this.opts(opts)

    this.sound1 = null
    this.sound2 = null
    this.id1    = null
    this.id2    = null
  }

  opts(opts) {
    this.speed = opts.speed || 'eighth'
    this.type  = opts.type  || 'harm'

    return this
  }

  play(root, intv, prevOffset = false) {
    this.stopAll()

    const bottom = root.semi
    const top    = root.semi + (intv.semi || 12)

    this.prevOffset = prevOffset
      ? this.prevOffset
      : this._randomOffset(top)

    this.sound1 = SOUNDS[this.prevOffset + bottom]
    this.sound2 = SOUNDS[this.prevOffset + top   ]

    if (this.type === 'harm') {
      this.playHarm()
    } else {
      this.playMelo()
    }
  }

  playHarm() {
    setTimeout(() => {
      this.sound1.play()
      this.sound2.play()
    }, 10)
  }

  playMelo() {
    const duration = this._duration()

    this.sound1.play()

    this.id1 = setTimeout(() => {
      this.sound2.play()
      this.stop(this.sound1)

      this.id2 = setTimeout(
        () => this.stop(this.sound2)
      , duration
      )
    }, duration)
  }

  stop(sound) {
     sound && sound.pause()
    ;sound && (sound.currentTime = 0)

    return this
  }

  stopAll() {
    this
      .stop(this.sound1)
      .stop(this.sound2)

    clearTimeout(this.id1)
    clearTimeout(this.id2)
  }

  _duration() {
    let mul = 1
    this.speed === 'quarter' && (mul = 1 / 2)
    this.speed === 'eighth'  && (mul = 1 / 4)

    return DURATION * mul
  }

  _randomOffset(top) {
    let offset

    offset = SOUNDS.length - 1 - top
    offset = Math.floor(offset / 12)
    offset = randomInt(0, offset) * 12

    return offset
  }
}

export default IntervalPlayer
