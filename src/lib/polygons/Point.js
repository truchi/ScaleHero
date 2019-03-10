export default class Point {
  constructor({ x = 0, y = 0 } = {}) {
    this.x = x || 0
    this.y = y || 0
  }

  opposite() {
    return this.clone(coord => -coord)
  }

  translate(vector = new Point()) {
    return new Point({
      x: this.x + vector.x,
      y: this.y + vector.y
    })
  }

  scale(value = new Point(), origin = new Point()) {
    if (typeof value === 'number')
      value = new Point({ x: value, y: value })

    return origin
      .translate(
        this
          .translate(origin.opposite())
          .clone((coord, axis) => coord * value[axis])
      )
  }

  rotate(angle = 0, center = new Point()) { // angle: clockwise degrees
    const rad = - 2 * Math.PI * angle / 360
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    const d = this.translate(center.opposite())
    const x = d.x * cos - d.y * sin
    const y = d.x * sin + d.y * cos


    return center
      .translate(new Point({ x, y }))
      .round(5)
  }

  round(precision = 1) {
    return this.clone(
      coord =>
        (Math.round(coord * Math.pow(10, precision)) / Math.pow(10, precision)) || 0
    )
  }

  quarterify(size = new Point(), fn = _ => _) {
    const point  = this.clone()
    const center = size.clone(coord => coord / 2)

    const angle = (() => {
      const [px, py, cx, cy] = [point.x, point.y, center.x, center.y]

      if (px > cx && py > cy) return 0
      if (px < cx && py > cy) return -90
      if (px < cx && py < cy) return -180
      return -270
    })()

    const transform = point => point.rotate(-angle, center).translate(center.opposite()).scale(2)
    const inverse   = point => point.scale(1/2).translate(center).rotate(angle, center)

    return inverse(fn(transform(point)))
  }

  clone(fn = _ => _) {
    return new Point({ x: fn(this.x, 'x'), y: fn(this.y, 'y') })
  }

  toString(unit = '', sep = ',') {
    return `${ this.x }${ unit }${ sep }${ this.y }${ unit }`
  }

  static intersection(
    { x: x1, y: y1 } = new Point(),
    { x: x2, y: y2 } = new Point(),
    { x: x3, y: y3 } = new Point(),
    { x: x4, y: y4 } = new Point()
  ) {
    const a    = x1 * y2 - y1 * x2
    const b    = x3 * y4 - y3 * x4
    const xNum = a * (x3 - x4) - b * (x1 - x2)
    const yNum = a * (y3 - y4) - b * (y1 - y2)
    const den  = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

    const x = xNum / den
    const y = yNum / den

    return new Point({ x, y })
  }
}
