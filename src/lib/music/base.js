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

    add(value) {
      return Base.value(this.value + value)
    }

    static value(i = VALUES[DEFAULTS.name]) {
      return new Base({
        name: NAMES[i % Base.N][0]
      })
    }
  }
}
