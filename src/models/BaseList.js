;(function() {
class BaseList {
  constructor(intervals = [new Interval], type = '') {
    this.intervals = intervals
    this.halfs     = this.intervals.map(interval => interval.halfs)
    this.length    = this.intervals.length

    this.name = ''
    this.type = type
  }

  whichDegree() {}

  equals() {}

  toString(halfs = false) {
    if (halfs) return this.halfs.join(' ')

    return this.intervals.map(interval => interval.name).join(' ')
  }
}

window.BaseList = BaseList
})()
