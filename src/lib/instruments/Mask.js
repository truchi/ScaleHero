import settable from '../../utils/settable'

const DEFAULTS = {
  position  : 0,
  definition: _ => []
}

export default class Mask extends settable({ DEFAULTS }) {
  _position
  _definition

  constructor({ position, definition } = {}) {
    super({ position, definition })
  }

  in(i = 0, j = 0) {
    const def = this._def[i]

    return def && (-1 !== def.findIndex(([min, max]) => min <= j && j <= max))
  }

  get _def() {
    return this._definition(this._position)
  }

  static in(masks = [], i = 0, j = 0) {
    return -1 !== masks.findIndex(mask => mask.in(i, j))
  }
}
