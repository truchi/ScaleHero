import settable from '../../utils/settable'
import Point from './Point.js'
import Rectangle from './Rectangle.js'
import Triangle from './Triangle.js'

const e    = .02
const sq2  = Math.sqrt(2)
const far  = s => (1 - s)
const mid  = s => (1 - s) / 2
const diag = s => ({ size: { x: sq2 * s, y: sq2 }, translate: { x: mid(sq2 * s), y: mid(sq2) } })

const SHAPES = {
  rect: {
    _constructor: Rectangle,
    top         : s => ({ size: { y: s } }),
    horizontal  : s => ({ size: { y: s }, translate: { y: mid(s) } }),
    bottom      : s => ({ size: { y: s }, translate: { y: far(s) } }),
    left        : s => ({ size: { x: s } }),
    vertical    : s => ({ size: { x: s + e }, translate: { x: mid(s + e) } }),
    right       : s => ({ size: { x: s }, translate: { x: far(s) } }),
    topleft     : s => ({ size: s }),
    topright    : s => ({ size: s, translate: { x: 1 / 2 } }),
    bottomleft  : s => ({ size: s, translate: { y: 1 / 2 } }),
    bottomright : s => ({ size: s, translate:      1 / 2   }),
    diamond     : s => ({ size: s, rotate: 45, scale: 1 / sq2 }),
    diagasc     : s => ({ ...diag(s), rotate: -45 }),
    diagdesc    : s => ({ ...diag(s), rotate:  45 }),
  },
  triangle: {
    _constructor: Triangle,
    topleft     : s => ({ size: 2 * s + e }),
    topright    : s => ({ size: 2 * s + e, scale: { x: -1, y:  1 } }),
    bottomleft  : s => ({ size: 2 * s + e, scale: { x:  1, y: -1 } }),
    bottomright : s => ({ size: 2 * s + e, scale: { x: -1, y: -1 } }),
  },
}

const TRANSITIONS = {
  east     : 0,
  northeast: 1,
  north    : 2,
  northwest: 3,
  west     : 4,
  southwest: 5,
  south    : 6,
  southeast: 7,
}

const getSize = polygon => {
  const bb = polygon.boundingBox()
  const tl = bb.points[0]
  const br = bb.points[2]

  return new Point({ x: br.x - tl.x, y: br.y - tl.y })
}

const SUBTYPES = Object.fromEntries(
  Object.entries(SHAPES)
    .map(
      ([type, data]) => [
        type,
        Object.keys(data).filter(subtype => subtype !== '_constructor')
      ]
    )
)

const DEFAULTS = {
  size      : 1,
  type      : 'rect',
  subtype   : 'top',
  transition: 'east'
}

export default class Mask extends settable({ DEFAULTS, after: '_set' }) {
  static TYPES       = Object.keys(SUBTYPES)
  static SUBTYPES    = SUBTYPES
  static TRANSITIONS = Object.keys(TRANSITIONS)
  angle
  _shape
  _size
  _type
  _subtype
  _transition

  constructor({ size, type, subtype, transition } = {}) {
    super({ size, type, subtype, transition })
  }

  _set() {
    this._shape = this._getShape().crop(new Rectangle({ x: 1, y: 1 }))
    this.angle  = this._getAngle()
  }

  get shape() {
    return { shape: this._shape }
  }

  enter(radius = 0) {
    return this._get(radius, w => new Point({ x: -w, y: 0 }))
  }

  leave(radius = 0) {
    return this._get(radius)
  }

  _get(radius = 0, start = _ => new Point()) {
    const s     = 2 * radius * (1 - sq2) + sq2 // css has max radius=.5, hence *2
    const shape = this._shape
      .rotate(-this.angle, new Point({ x: .5, y: .5 }))
      .crop(
        new Rectangle({ x: s, y: s })
          .translate(new Point({ x: (1 - s) / 2, y: (1 - s) / 2 }))
      )
      .boundingBox()
    const width = getSize(shape).x

    return {
      shape: shape.translate(start(width)),
      width
    }
  }

  _getShape() {
    if (!Mask.TYPES.includes(this._type))
      throw new Error(`Invalid type "${ this._type }" (${ Mask.TYPES.join(', ') })`)

    if (!Mask.SUBTYPES[this._type].includes(this._subtype))
      throw new Error(`Invalid subtype "${ this._subtype }" for type "${ this._type }" (${ Mask.SUBTYPES[this._type].join(', ') })`)

    const constructor = SHAPES[this._type]._constructor
    const data        = SHAPES[this._type][this._subtype](this._size)
    let { size, translate, rotate, scale } = Object.assign({
      size     : {},
      translate: {},
      rotate   : 0,
      scale    : {},
    }, data)

    if (typeof size      === 'number') size      = { x: size     , y: size      }
    if (typeof translate === 'number') translate = { x: translate, y: translate }
    if (typeof scale     === 'number') scale     = { x: scale    , y: scale     }

    size      = Object.assign({ x: 1, y: 1 }, size)
    translate = Object.assign({ x: 0, y: 0 }, translate)
    scale     = Object.assign({ x: 1, y: 1 }, scale)

    const center = new Point({ x: 1/2, y: 1/2 })
    return new constructor(new Point(size))
      .translate(translate)
      .rotate   (rotate, center)
      .scale    (scale , center)
  }

  _getAngle() {
    if (!Mask.TRANSITIONS.includes(this._transition))
      throw new Error(`Invalid transition "${ this._transition }" (${ Mask.TRANSITIONS.join(', ') })`)

    return TRANSITIONS[this._transition] * 45
  }
}