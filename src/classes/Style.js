import settable from '../utils/settable'

const DEFAULTS = {
  color      : 'transparent',
  radius     : 0,
  strokeWidth: 0,
  strokeColor: 'transparent',
}

export default class Style extends settable({ DEFAULTS }) {
  _color
  _radius
  _strokeWidth
  _strokeColor

  constructor({ color, radius, stroke: { width: strokeWidth, color: strokeColor } = {} } = {}) {
    super({ color, radius, strokeWidth, strokeColor })
  }

  toJSON() {
    return {
      color : this._color,
      radius: this._radius,
      stroke: {
        width: this._strokeWidth,
        color: this._strokeColor,
      }
    }
  }
}
