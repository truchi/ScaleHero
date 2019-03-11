import Polygon from './Polygon.js'
import Point from './Point.js'
import Rectangle from './Rectangle.js'
import Triangle from './Triangle.js'

const sq2 = Math.sqrt(2)
const SHAPES = s => ({
  rect: {
    _constructor: Rectangle,
    top         : { size: { y: s }                                },
    horizontal  : { size: { y: s }, translate: { y: (1 - s) / 2 } },
    bottom      : { size: { y: s }, translate: { y:  1 - s      } },
    left        : { size: { x: s }                                },
    vertical    : { size: { x: s }, translate: { x: (1 - s) / 2 } },
    right       : { size: { x: s }, translate: { x:  1 - s      } },
    topleft     : { size: s                          },
    topright    : { size: s, translate: { x: 1 / 2 } },
    bottomleft  : { size: s, translate: { y: 1 / 2 } },
    bottomright : { size: s, translate:      1 / 2   },
    diamond     : { size: s, rotate: 45, scale: 1 / sq2 },
    diagasc     : { size: { x: sq2 * s,  y: sq2 }, translate: { x: (1 - sq2 * s) / 2, y: (1 - sq2) / 2 }, rotate: -45 },
    diagdesc    : { size: { x: sq2 * s,  y: sq2 }, translate: { x: (1 - sq2 * s) / 2, y: (1 - sq2) / 2 }, rotate:  45 },
  },
  triangle: {
    _constructor: Triangle,
    topleft     : { size: 2 * s                          },
    topright    : { size: 2 * s, scale: { x: -1, y:  1 } },
    bottomleft  : { size: 2 * s, scale: { x:  1, y: -1 } },
    bottomright : { size: 2 * s, scale: { x: -1, y: -1 } },
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

const getShape = (s, type, subtype) => {
  const types     = SHAPES(s)
  const typesList = Object.keys(types)

  if (!typesList.includes(type))
    throw new Error(`Invalid type "${ type }" (${ typesList.join(', ') })`)

  const subtypes     = types[type]
  const subtypesList = Object.keys(subtypes)

  if (!subtypesList.includes(subtype) || subtype === '_constructor')
    throw new Error(`Invalid subtype "${ subtype }" for type "${ type }" (${ subtypesList.join(', ') })`)

  const constructor = subtypes._constructor
  let { size, translate, rotate, scale } = Object.assign({
    size     : {},
    translate: {},
    rotate   : 0,
    scale    : {},
  }, subtypes[subtype])

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

const getSize = polygon => {
  const bb = polygon.boundingBox()
  const tl = bb.points[0]
  const br = bb.points[2]

  return new Point({ x: br.x - tl.x, y: br.y - tl.y })
}

const getTransition = (trans) => {
  const transition = TRANSITIONS[trans]
  if (!transition)
    throw new Error(`Invalid transition "${ trans }" (${ Object.keys(TRANSITIONS).join(', ') })`)

  return transition
}

const getAnimation = (p, c, a) => (s, e) => ({
  points: p.toString(),
  animation: {
    origin: c.toString('px', ' '),
    // Screen has -y...
    from:
      `rotate(${ -a }deg) translate(${ s.toString('px') })`,
    to:
      `rotate(${ -a }deg) translate(${ e.toString('px') })`
  }
})

const getDebug = (rotated, boxed, size, dir, start, end) => ({
  rotated: rotated.toString(),
  boxed  : boxed.toString(),
  size   : size.toString(),
  dir    : dir.toString(),
  start  : { enter: start.enter.toString(), leave: start.leave.toString() },
  end    : { enter:   end.enter.toString(), leave:   end.leave.toString() }
})

const get = (s = 1, type = 'rect', subtype = 'top', trans = 'north') => {
  const shape           = getShape(s, type, subtype).crop(new Rectangle({ x: 1, y: 1 }))
  const { x, y, angle } = getTransition(trans)
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

  const animation = getAnimation(boxed, center, angle)
  return {
    shape: { points: shape.toString() },
    enter: animation(start.enter, end.enter),
    leave: animation(start.leave, end.leave),
    debug: {
      s, type, trans,
      ...getDebug(rotated, boxed, size, dir, start, end),
      angle
    }
  }
}

window.get = get
export { get }
export default {
  Polygon,
  Point,
  Rectangle,
  Triangle,
}
