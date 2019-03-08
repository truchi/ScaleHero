import Polygon from './Polygon'
import Point from './Point'

const X = Polygon.X
const Y = Polygon.Y

const SCALES = {
  topleft    : { x:  1, y:  1 },
  topright   : { x: -1, y:  1 },
  bottomleft : { x:  1, y: -1 },
  bottomright: { x: -1, y: -1 }
}
export default class Triangle extends Polygon {
  constructor(size = new Point({ x: X, y: Y })) {
    super()

    this.points = [
      new Point(),
      new Point({ x: size.x }),
      new Point({ y: size.y }),
    ]
  }

  static make(size = 1, type = 'topleft') {
    return new Triangle(new Point({ x: size * X, y: size * Y }))
      .scale(
        new Point(
          SCALES[type]
            ? SCALES[type]
            : SCALES['topleft']
        ),
        new Point({ x: X / 2, y: Y / 2 })
      )
  }

  static get TYPES() {
    return Object.keys(SCALES)
  }
}
