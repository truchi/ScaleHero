const N     = 12
const M     = 7
const FLAT  = '♭'
const SHARP = '♯'

class BaseItem {
  constructor(name, klass) {
    const { full, short, accidentals } = klass._parse(name)

    this.name  = { full, short, accidentals }
    this.halfs = klass._mod(klass.N2H[short] + accidentals, N)
  }

  inverse() {
    let klass = this.constructor

    return klass.fromHalfs(klass._mod(N - this.halfs, N))
  }

  add(item) {
    return this.constructor.fromHalfs(this.halfs + item.halfs)
  }

  clone(klass) {
    return new klass(this.name.full)
  }

  static dist(item1, item2) {
    return item1.constructor.fromHalfs(Math.abs(item2.halfs - item1.halfs))
  }

  static fromHalfs(halfs, klass) {
    halfs = klass._mod(halfs, N)

    return new klass(klass.H2N[halfs])
  }

  static _parse({ full, short, accidentals }) {
    accidentals = accidentals.length - 2 * (
      accidentals.match(new RegExp(`${FLAT}`, 'g')) || []
    ).length

    return { full, short, accidentals }
  }

  static _mod(i, j) {
    return ((i % j) + j) % j
  }

  static fromNamesString(string, klass) {
    return string.split(' ').map(i => new klass(i))
  }
}

BaseItem.N     = N
BaseItem.M     = M
BaseItem.FLAT  = FLAT
BaseItem.SHARP = SHARP

export default BaseItem
