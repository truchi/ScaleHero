import BaseList from './BaseList'
import Interval from './Interval'
import Scale    from './Scale'

class Mode extends BaseList {
  constructor(intervals) {
    super(intervals, 'mode')

    this.scale
    this.includes   = []
    this.includedIn = []
  }

  static fromScale(scale) {
    let intervals = Array.from(scale.intervals)
    let prev      = new Interval(1)

    intervals = intervals.map(interval => prev = prev.add(interval))
    intervals.unshift(intervals.pop().inverse())

    return new Mode(intervals)
  }

  toScale() {
    return Scale.fromMode(this)
  }

  whichDegree(mode) {
    return this.toScale().whichDegree(mode.toScale())
  }

  equals(mode) {
    return this.whichDegree(mode) === 0
  }

  doIncludes(mode) {
    if (this.length <= mode.length) return false

    let halfs = this.halfs

    for (let interval of mode.intervals) {
      if(!halfs.includes(interval.halfs)) return false
    }

    return true
  }

  isIncludedIn(mode) {
    return mode.doIncludes(this)
  }

  getDegree(note) {
    for(let interval of this.intervals) {
      if (interval.halfs === note.halfs) return interval.clone()
    }

    return null
  }
}

export default Mode
