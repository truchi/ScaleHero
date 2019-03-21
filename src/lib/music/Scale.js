import settable from '../../utils/settable'
import Note from './Note'
import Interval from './Interval'

const DEFAULTS = {
  root     : new Note(),
  intervals: []
}

export default class Scale extends settable({ DEFAULTS }) {
  _root
  _intervals

  constructor({ root, intervals } = {}) {
    super({ root, intervals })
  }

  notes() {
    return this._intervals.map(interval => this._root.add(interval.value))
  }
}
