const DEFAULTS = {
  position  : 0,
  definition: _ => []
}

export default class Mask {
  #position   = DEFAULTS.position
  #definition = DEFAULTS.definition

  constructor({ position, definition } = {}) {
    this.set({ position, definition })
  }

  set({ position = this.#position, definition = this.#definition } = {}) {
    ({ position, definition } = { ...DEFAULTS, position, definition })

    this.#position   = position
    this.#definition = definition

    return this
  }

  in(i = 0, j = 0) {
    const def = this._def[i]

    return def && (-1 !== def.findIndex(([min, max]) => min <= j && j <= max))
  }

  get _def() {
    return this.#definition(this.#position)
  }

  static in(masks = [], i = 0, j = 0) {
    return -1 !== masks.findIndex(mask => mask.in(i, j))
  }
}
