;(function() {
const N     = 12
const M     = 7
const FLAT  = '♭'
const SHARP = '♯'
const N2H   = { '1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11 }

class Interval {
  constructor(name = '1') {
    this.name  = '' + name
    this.halfs = Interval.toHalfs(this.name)
  }

  inverse() {
    return Interval.fromHalfs(Interval._mod(N - this.halfs, N))
  }

  add(interval) {
    return Interval.fromHalfs(this.halfs + interval.halfs)
  }

  static dist(interval1, interval2) {
    return Interval.fromHalfs(Math.abs(interval2.halfs - interval1.halfs))
  }

  static fromHalfs(halfs) {
    let interval   = new Interval
    interval.halfs = Interval._mod(halfs, N)

    return interval
  }

  static toHalfs(name) {
    var [name, accidentals, i] = new RegExp(
      `([${FLAT}|${SHARP}]*)(\\d*)`
    ).exec(name)
    i = '' + (Interval._mod(+i - 1, M) + 1)

    let flats  = (accidentals.match(new RegExp(`${FLAT}`, 'g')) || []).length;
    let sharps = accidentals.length - flats
    let halfs  = N2H[i] + sharps - flats

    return Interval._mod(halfs, N)
  }

  static _mod(i, j) {
    return ((i % j) + j) % j
  }

  static fromNamesString(string) {
    return string.split(' ').map(i => new Interval(i))
  }
}

window.Interval = Interval
})()
