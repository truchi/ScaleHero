import Note from './Note'
import Interval from './Interval'

const DEFAULTS = {
  root     : new Note(),
  intervals: []
}

export default class Scale {
  #root      = DEFAULTS.root
  #intervals = DEFAULTS.intervals

  constructor({ root, intervals } = {}) {
    this.set({ root, intervals })
  }

  set({ root = this.#root, intervals = this.#intervals } = {}) {
    ({ root, intervals } = { ...DEFAULTS, root, intervals })

    this.#root      = root
    this.#intervals = intervals

    return this
  }

  notes() {
    return this.#intervals.map(interval => this.#root.add(interval.value))
  }
}
