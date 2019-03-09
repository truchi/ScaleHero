import Polygon from './Polygon.js'
import Point from './Point.js'
import Rectangle from './Rectangle.js'
import Triangle from './Triangle.js'
import Diamond from './Diamond.js'

const TRANSITIONS = {
  north    : { angle:   0, x:  0, y: -1 },
  east     : { angle:   0, x:  1, y:  0 },
  south    : { angle:   0, x:  0, y:  1 },
  west     : { angle:   0, x: -1, y:  0 },
  northeast: { angle: -45, x:  1, y:  0 },
  northwest: { angle:  45, x: -1, y:  0 },
  southeast: { angle:  45, x:  1, y:  0 },
  southwest: { angle: -45, x: -1, y:  0 }
}

const make      = (constructor, fn) => (size, type) => constructor.make(fn(size), type)
const rectangle = make(Rectangle, s => s)
const triangle  = make(Triangle , s => 2 * s)
const diamond   = make(Diamond  , s => s > 1 / 2 ? 0 : 2 * (Polygon.X - 2 * s))

const getShape = (size, type) => {
  if (Rectangle.TYPES.includes(type)) return rectangle(size, type)
  if ( Triangle.TYPES.includes(type)) return triangle (size, type)
  if (  Diamond.TYPES.includes(type)) return diamond  (size, type)

  const types = Rectangle.TYPES.concat(Triangle.TYPES).concat(Diamond.TYPES)
  throw new Error(`Invalid type "${ type }" (${ types.join(', ') })`)
}

const getTransition = (trans) => {
  const transition = TRANSITIONS[trans]
  if (!transition)
    throw new Error(`Invalid transition "${ trans }" (${ Object.keys(TRANSITIONS).join(', ') })`)

  return transition
}

const getSize = polygon => {
  const bb = polygon.boundingBox()
  const tl = bb.points[0]
  const br = bb.points[2]

  return new Point({ x: br.x - tl.x, y: br.y - tl.y })
}

const getAnimation = (p, c, a) => (s, e) => ({
  points: p.toString(),
  animation: {
    origin: c.toString('px', ' '),
    from:
      `rotate(${ a }deg) translate(${ s.toString('px') })`,
    to:
      `rotate(${ a }deg) translate(${ e.toString('px') })`
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

const get = (s = 1, type = 'top', trans = 'north') => {
  const shape           = getShape(s, type).crop(Rectangle.make())
  const { x, y, angle } = getTransition(trans)
  const dir             = new Point({ x, y })

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

export { get }
export default { Polygon, Point, Rectangle, Triangle, Diamond }
