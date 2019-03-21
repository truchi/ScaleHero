export default ({ DEFAULTS = {}, validate = _ => true, Base = class {}, prefix = '_' }) => class extends Base {
  constructor(props) {
    super()
    this.set(props)
  }

  set(props) {
    const that = {}
    Object.entries(DEFAULTS)
      .forEach(([name, value]) =>
        that[name] = props[name] || this[prefix + name] || value
      )

    validate(that)
      && Object.entries(that)
        .forEach(([name, value]) => this[prefix + name] = value)

    this._afterSet && this._afterSet()

    return this
  }
}
