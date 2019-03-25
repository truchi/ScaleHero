import Interval from '../lib/music/Interval'
import Style from './Style'

export default class Palette {
  constructor(style = new Style()) {
    let fn
    const apply = fn => Object.keys(Interval.VALUES)
      .map(name => [
        name,
        fn(new Interval({ name })) || new Style()
      ])

    if (style instanceof Style)
      fn = () => style
    else if (typeof style === 'function')
      fn = style
    else
      throw new Error(`First argument is either a Style or a function`)

    this._styles = Object.fromEntries(apply(fn))
  }

  get(interval) {
    return interval instanceof Interval
      ? this._styles[interval.name]
      : new Style()
  }

}
