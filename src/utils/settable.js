export default ({
  DEFAULTS = {},
  validate = _ => true,
  Base = class {},
  prefix = '_',
  after = null,
}) => class extends Base {
  constructor(props) {
    super()
    this.set(props)
  }

  set(props) {
    const object = {}
    Object.entries(DEFAULTS)
      .forEach(([name, value]) =>
        object[name] = [props[name], this[prefix + name], value].find(value => value !== undefined)
      )

    let valid = validate(object)
    if (valid === false || valid === null)
      throw new Error('Invalid props', props)

    if (valid === true || valid === undefined)
      valid = object

    Object.entries(valid)
        .forEach(([name, value]) => this[prefix + name] = value)

    after && this[after] && this[after]()

    return this
  }
}
