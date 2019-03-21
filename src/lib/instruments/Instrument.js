import { Note } from '../music'
import Mask from './Mask'

const DEFAULTS = {
  tuning: [],
  from  : 0,
  to    : Note.N,
  masks : []
}

export default class Instrument {
  #tuning = DEFAULTS.tuning
  #from   = DEFAULTS.from
  #to     = DEFAULTS.to
  #masks  = DEFAULTS.masks

  constructor({ tuning, from, to, masks } = {}) {
    this.set({ tuning, from, to, masks })
  }

  set({ tuning = this.#tuning, from = this.#from, to = this.#to, masks = this.#masks } = {}) {
    ({ tuning, from, to, masks } = { ...DEFAULTS, tuning, from, to, masks })

    if (from > to)
      throw new Error(`from (${ from }) is geater than to (${ to })`)

    this.#tuning = tuning
    this.#from   = from
    this.#to     = to
    this.#masks  = masks

    return this
  }

  get length() {
    return this.#to - this.#from + 1
  }

  strings(cb = _ => _) {
    return [...this.#tuning]
      .map((note, index) => ({
        stringIndex: index,
        stringNote : note
      }))
      .map(({ stringIndex, stringNote }) =>
        Array.from(
          Array(this.length),
          (v, boxIndex) =>
            cb({
              note: stringNote.add(this.#from + boxIndex),
              in  : Mask.in(this.#masks, stringIndex, this.#from + boxIndex)
            })
        )
      )
  }
}
