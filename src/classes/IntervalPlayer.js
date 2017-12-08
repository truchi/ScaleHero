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
    this.speed = opts.speed || 'half'
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

    setTimeout(() => {
      this.sound1.play()

      if (this.type === 'harm') {
        this.sound2.play()

      } else {
        this.id1 = setTimeout(() => {
          if (this.speed === 'half') {
            this.stop(this.sound1)

            this.id2 = setTimeout(
              () => this.stop(this.sound2)
            , DURATION / 2
            )
          }

          this.sound2.play()

        }, DURATION  * (this.speed === 'half' ? 1/2 : 1))
      }

    })
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

  _randomOffset(top) {
    let offset

    offset = SOUNDS.length - 1 - top
    offset = Math.floor(offset / 12)
    offset = randomInt(0, offset) * 12

    return offset
  }
}

export default IntervalPlayer
