import Polygon from './Polygon'
import Point from './Point'
import Rectangle from './Rectangle'

const X = Polygon.X
const Y = Polygon.Y

export default class Diamond extends Polygon {
  constructor(size = new Point({ x: X, y: Y })) {
    super()

    const x = (X - size.x) / 2
    const y = (Y - size.y) / 2
    this.points = [
      new Point({ x: X / 2, y  }),
      new Point({ x: X - x, y: Y / 2 }),
      new Point({ x: X / 2, y: Y - y }),
      new Point({ x, y: Y / 2 }),
    ]
  }

  static make(size = 1) {
    return new Diamond(new Point({ x: size * X, y: size * Y }))
  }

  static get TYPES() {
    return ['diamond']
  }
}
