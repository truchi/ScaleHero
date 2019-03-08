import Polygon from './Polygon'
import Point from './Point'

const X = Polygon.X
const Y = Polygon.Y

const TRANSLATIONS = {
  top       : s => [{ x: 1, y: s }, { x: 0          , y: 0           }],
  horizontal: s => [{ x: 1, y: s }, { x: 0          , y: (1 - s) / 2 }],
  bottom    : s => [{ x: 1, y: s }, { x: 0          , y: (1 - s)     }],
  left      : s => [{ x: s, y: 1 }, { x: 0          , y: 0           }],
  vertical  : s => [{ x: s, y: 1 }, { x: (1 - s) / 2, y: 0           }],
  right     : s => [{ x: s, y: 1 }, { x: (1 - s)    , y: 0           }]
}

export default class Rectangle extends Polygon {
  constructor(size = new Point({ x: X, y: Y })) {
    super()

    this.points = [
      new Point(),
      new Point({ x: size.x }),
      new Point({ x: size.x, y: size.y }),
      new Point({ y: size.y }),
    ]
  }

  static make(size = 1, type = 'top') {
    const ext      = new Point({ x: X, y: Y })
    const [ s, t ] = (
      TRANSLATIONS[type]
        ? TRANSLATIONS[type]
        : TRANSLATIONS['top']
    )(size)

    return new Rectangle(new Point(s).scale(ext))
      .translate(new Point(t).scale(ext))
  }

  static get TYPES() {
    return Object.keys(TRANSLATIONS)
  }
}
