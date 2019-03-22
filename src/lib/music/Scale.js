import settable from '../../utils/settable'
import Note from './Note'

const DEFAULTS = {
  intervals: []
}

export default class Scale extends settable({ DEFAULTS }) {
  _intervals

  constructor({ intervals } = {}) {
    super({ intervals })
  }

  notes(root = new Note()) {
    return this._intervals.map(interval => root.add(interval.value))
  }

  get(root = new Note(), note = new Note()) {
    return this._intervals.find(interval => root.add(interval).equals(note))
  }
}
