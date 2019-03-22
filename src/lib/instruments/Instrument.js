import settable from '../../utils/settable'
import { Note } from '../music'
import Mask from './Mask'

const DEFAULTS = {
  tuning: [],
  from  : 0,
  to    : Note.N
}
const validate = that => {
  const { from, to } = that

  if (from > to)
    throw new Error(`from (${ from }) is geater than to (${ to })`)
}

export default class Instrument extends settable({ DEFAULTS, validate }) {
  _tuning
  _from
  _to

  constructor({ tuning, from, to } = {}) {
    super({ tuning, from, to })
  }

  get length() {
    return this._to - this._from + 1
  }

  strings({ masks = [], cb = _ => _ }) {
    return [...this._tuning]
      .map((note, index) => ({
        stringIndex: index,
        stringNote : note
      }))
      .map(({ stringIndex, stringNote }) =>
        Array.from(
          Array(this.length),
          (v, boxIndex) =>
            cb({
              note: stringNote.add(this._from + boxIndex),
              in  : Mask.in(masks, stringIndex, this._from + boxIndex)
            })
        )
      )
  }
}
