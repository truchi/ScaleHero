import Point from './Point.js'
import Rectangle from './Rectangle.js'
import Triangle from './Triangle.js'

const e    = .02
const sq2  = Math.sqrt(2)
const far  = s => (1 - s)
const mid  = s => (1 - s) / 2
const diag = s => ({ size: { x: sq2 * s, y: sq2 }, translate: { x: mid(sq2 * s), y: mid(sq2) } })

const SHAPES = s => ({
  rect: {
    _constructor: Rectangle,
    top         : { size: { y: s } },
    horizontal  : { size: { y: s }, translate: { y: mid(s) } },
    bottom      : { size: { y: s }, translate: { y: far(s) } },
    left        : { size: { x: s } },
    vertical    : { size: { x: s + e }, translate: { x: mid(s + e) } },
    right       : { size: { x: s }, translate: { x: far(s) } },
    topleft     : { size: s },
    topright    : { size: s, translate: { x: 1 / 2 } },
    bottomleft  : { size: s, translate: { y: 1 / 2 } },
    bottomright : { size: s, translate:      1 / 2   },
    diamond     : { size: s, rotate: 45, scale: 1 / sq2 },
    diagasc     : { ...diag(s), rotate: -45 },
    diagdesc    : { ...diag(s), rotate:  45 },
  },
  triangle: {
    _constructor: Triangle,
    topleft     : { size: 2 * s + e },
    topright    : { size: 2 * s + e, scale: { x: -1, y:  1 } },
    bottomleft  : { size: 2 * s + e, scale: { x:  1, y: -1 } },
    bottomright : { size: 2 * s + e, scale: { x: -1, y: -1 } },
  },
})

const TRANSITIONS = {
  north    : { angle:   0, x:  0, y:  1 },
  east     : { angle:   0, x:  1, y:  0 },
  south    : { angle:   0, x:  0, y: -1 },
  west     : { angle:   0, x: -1, y:  0 },
  northeast: { angle:  45, x:  1, y:  0 },
  northwest: { angle: -45, x: -1, y:  0 },
  southeast: { angle: -45, x:  1, y:  0 },
  southwest: { angle:  45, x: -1, y:  0 }
}

const getSize = polygon => {
  const bb = polygon.boundingBox()
  const tl = bb.points[0]
  const br = bb.points[2]

  return new Point({ x: br.x - tl.x, y: br.y - tl.y })
}

const getAnimation = (points, origin, rotate) =>
  (start, end) => ({
    points,
    animation: {
      origin,
      from: {
        rotate,
        translate: start
      },
      to: {
        rotate,
        translate: end
      }
    }
  })

const animationToString = function() { return `rotate(${ this.rotate }deg) translate(${ this.translate.toString('px') })` }
const toStrings = function() {
  return {
    points: this.points.toString(),
    animation: {
      origin: this.animation.origin.toString('px', ' '),
      from  : animationToString.call(this.animation.from),
      to    : animationToString.call(this.animation.to  ),
    }
  }
}

const DEFAULTS = {
  size      : 1,
  type      : 'rect',
  subtype   : 'top',
  transition: 'east'
}

export default class Mask {
  #size       = DEFAULTS.size
  #type       = DEFAULTS.type
  #subtype    = DEFAULTS.subtype
  #transition = DEFAULTS.transition

  constructor({ size, type, subtype, transition } = {}) {
    this.set({ size, type, subtype, transition })
  }

  set({ size = this.#size, type = this.#type, subtype = this.#subtype, transition = this.#transition } = {}) {
    ({ size, type, subtype, transition } = { ...DEFAULTS, size, type, subtype, transition })

    this.#size       = size
    this.#type       = type
    this.#subtype    = subtype
    this.#transition = transition

    this._make()

    return this
  }

  _make() {
    const shape           = this._shape().crop(new Rectangle({ x: 1, y: 1 }))
    const { x, y, angle } = this._transition()
    const dir             = new Point({ x, y: -y }) // Screen has -y...

    const center  = shape.center()
    const rotated = shape.rotate(-angle, center)
    const boxed   = rotated.boundingBox()
    const size    = getSize(boxed)

    const start = {
      enter: size.scale(dir.opposite()),
      leave: new Point()
    }
    const end = {
      enter: start.enter.translate(size.scale(dir)),
      leave: start.leave.translate(size.scale(dir))
    }

    // Screen has -y...
    const animation = getAnimation(boxed, center, -angle)

    this.shape = shape
    this.enter = animation(start.enter, end.enter)
    this.leave = animation(start.leave, end.leave)

    this.enter.toStrings = toStrings.bind(this.enter)
    this.leave.toStrings = toStrings.bind(this.leave)

    return this
  }

  _shape() {
    const types     = SHAPES(this.#size)
    const typesList = Object.keys(types)

    if (!typesList.includes(this.#type))
      throw new Error(`Invalid type "${ this.#type }" (${ typesList.join(', ') })`)

    const subtypes     = types[this.#type]
    const subtypesList = Object.keys(subtypes)

    if (!subtypesList.includes(this.#subtype) || this.#subtype === '_constructor')
      throw new Error(`Invalid subtype "${ this.#subtype }" for type "${ this.#type }" (${ subtypesList.join(', ') })`)

    const constructor = subtypes._constructor
    let { size, translate, rotate, scale } = Object.assign({
      size     : {},
      translate: {},
      rotate   : 0,
      scale    : {},
    }, subtypes[this.#subtype])

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

  _transition() {
    const transition = TRANSITIONS[this.#transition]
    if (!transition)
      throw new Error(`Invalid transition "${ this.#transition }" (${ Object.keys(TRANSITIONS).join(', ') })`)

    return transition
  }
}
