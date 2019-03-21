export default (VALUES, type) => {
  const NAMES = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: []
  }
  Object.entries(VALUES).forEach(([name, value]) => NAMES[value].push(name))

  const DEFAULTS = {
    name: NAMES[0]
  }

  return class Base {
    static N = 12
    type  = type
    #name = DEFAULTS.name

    constructor({ name } = {}) {
      this.set({ name })
    }

    set({ name = this.#name } = {}) {
      ({ name } = { ...DEFAULTS, name })

      this.#name = name

      return this
    }

    get name() {
      return this.#name
    }

    get value() {
      return VALUES[this.#name]
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
