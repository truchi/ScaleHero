import settable from '../../utils/settable'

const DEFAULTS = {
  definition: _ => []
}

export default class Mask extends settable({ DEFAULTS }) {
  _position
  _definition

  constructor({ definition } = {}) {
    super({ definition })
  }

  in(position = 0, i = 0, j = 0) {
    const def = this._definition(position)[i]

    return def && (-1 !== def.findIndex(([min, max]) => min <= j && j <= max))
  }

  static in(masks = [], i = 0, j = 0) {
    return masks.length
      ? -1 !== masks.findIndex(({ position, mask }) => mask.in(position, i, j))
      : true
  }
}
