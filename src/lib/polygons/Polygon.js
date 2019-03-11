import Point from './Point'

export default class Polygon {
  points = []

  constructor(points = []) {
    this.points = points
  }

  translate(vector = new Point()) {
    return this.clone(point => point.translate(vector))
  }

  rotate(angle = 0, center = new Point()) {
    return this.clone(point => point.rotate(angle, center))
  }

  scale(value = new Point(), origin = new Point()) {
    return this.clone(point => point.scale(value, origin))
  }

  center() {
    const l = this.points.length
    if (!l) return new Point()

    const sum = this.points
      .reduce(
        (sum, point) => ({
            x: sum.x + point.x,
            y: sum.y + point.y
        }),
        { x: 0, y: 0 }
      )

    return new Point({
      x: sum.x / l,
      y: sum.y / l
    })
  }

  boundingBox() {
    const first = this.points[0] || new Point()

    const { minX, maxX, minY, maxY } = this.points
      .reduce(
        (carry, point) => ({
          minX: Math.min(carry.minX, point.x),
          maxX: Math.max(carry.maxX, point.x),
          minY: Math.min(carry.minY, point.y),
          maxY: Math.max(carry.maxY, point.y)
        }),
        { minX: first.x, maxX: first.x, minY: first.y, maxY: first.y }
      )

    return new Polygon([
      new Point({ x: minX, y: minY }),
      new Point({ x: maxX, y: minY }),
      new Point({ x: maxX, y: maxY }),
      new Point({ x: minX, y: maxY })
    ])
  }

  clone(fn = _ => _) {
    return new Polygon(
      this.points.map(
        point => fn(point.clone())
      )
    )
  }

  toString() {
    return this.points.map(point => point.toString()).join(' ')
  }

  // Sutherland–Hodgman algorithm
  // @see https://www.geeksforgeeks.org/polygon-clipping-sutherland-hodgman-algorithm-please-change-bmp-images-jpeg-png/
  crop(area = new Polygon()) {
    const points = area.points
    const length = points.length

    return points.reduce(
      (polygon, I, i) => polygon.cropLine(I, points[(i + 1) % length]),
      this.clone()
    )
  }

  cropLine({ x: x1, y: y1 } = new Point(), { x: x2, y: y2 } = new Point()) {
    const points = this.clone().points
    const length = points.length

    const p1 = new Point({ x: x1, y: y1 })
    const p2 = new Point({ x: x2, y: y2 })

    const inside = pos => pos > 0

    return points.reduce(
      (polygon, I, i) => {
        const J = points[(i + 1) % length]
        const { x: xI, y: yI } = I
        const { x: xJ, y: yJ } = J

        const iPos = (x2 - x1) * (yI - y1) - (y2 - y1) * (xI - x1)
        const jPos = (x2 - x1) * (yJ - y1) - (y2 - y1) * (xJ - x1)
        const iIns = inside(iPos)
        const jIns = inside(jPos)

        if (iIns && jIns) {
          polygon.points.push(J)
        } else if (!iIns && jIns) {
          polygon.points.push(Point.intersection(p1, p2, I, J))
          polygon.points.push(J)
        } else if (iIns && !jIns) {
          polygon.points.push(Point.intersection(p1, p2, I, J))
        }

        return polygon
      },
      new Polygon()
    )
  }
}
