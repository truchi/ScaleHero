import Polygon from './Polygon'
import Point from './Point'

export default class Rectangle extends Polygon {
  constructor(size = new Point()) {
    super()

    this.points = [
      new Point(),
      new Point({ x: size.x }),
      new Point({ x: size.x, y: size.y }),
      new Point({ y: size.y }),
    ]
  }
}
