import BaseList from './BaseList'
import Interval from './Interval'
import Mode     from './Mode'

class Scale extends BaseList {
  constructor(intervals) {
    super(intervals, 'scale')

    this.modes = []
  }

  static fromMode(mode) {
    let intervals = Array.from(mode.intervals)
    let prev      = new Interval(1)

    intervals.push(prev)
    intervals = intervals.map(interval => {
      let dist = Interval.dist(prev, interval)
      prev     = interval

      return dist
    })

    intervals.shift()
    intervals.push(intervals.pop().inverse())

    return new Scale(intervals)
  }

  toMode() {
    return Mode.fromScale(this)
  }

  whichDegree(scale) {
    if (this.length !== scale.length) return -1

    let str1 = this .toString(true)
    let str2 = scale.toString(true)

    let i = str1.concat(' ', str1).indexOf(str2)

    if (i === -1 || i === 0) return i
    return i / 2 + 1
  }

  equals(scale) {
    return this.whichDegree(scale) !== -1
  }
}

export default Scale
