import settable from '../../utils/settable'

export default (VALUES) => {
  const NAMES = {
    0: [], 1: [], 2: [], 3: [],  4: [],  5: [],
    6: [], 7: [], 8: [], 9: [], 10: [], 11: []
  }
  Object.entries(VALUES).forEach(([name, value]) => NAMES[value].push(name))

  const DEFAULTS = {
    name: NAMES[0][0]
  }

  return class Base extends settable({ DEFAULTS }) {
    static N      = 12
    static VALUES = VALUES
    static NAMES  = NAMES
    _name

    constructor({ name } = {}) {
      super({ name })
    }

    get name() {
      return this._name
    }

    get value() {
      return VALUES[this._name]
    }

    add(other = new Base()) {
      return Base.value(this.value + other.value, this.constructor)
    }

    equals(other = new Base()) {
      return this.value === other.value
    }

    static value(value = VALUES[DEFAULTS.name], Class = Base) {
      return new Class({
        name: NAMES[value % Base.N][0]
      })
    }
  }
}
