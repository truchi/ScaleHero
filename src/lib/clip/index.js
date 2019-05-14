import {
  ap,
  compose,
  map,
  mergeAll,
  values,
} from 'ramda'

const topLeft     = s => [0, 0]              // Top    left  point
const topRight    = s => [1, 0]              // Top    right point
const bottomLeft  = s => [0, 1]              // Bottom left  point
const bottomRight = s => [1, 1]              // Bottom right point
const top         = s => [s, 0]              // Top    border
const bottom      = s => [s, 1]              // Bottom border
const left        = s => [0, s]              // Left   border
const right       = s => [1, s]              // Right  border
const oTop        = s => top   (1 - s)       // Top    border (from right )
const oBottom     = s => bottom(1 - s)       // Bottom border (from right )
const oLeft       = s => left  (1 - s)       // Left   border (from bottom)
const oRight      = s => right (1 - s)       // Right  border (from bottom)
const rTop        = s => top   ((1 + s) / 2) // Top    border (right  of center)
const rBottom     = s => bottom((1 + s) / 2) // Bottom border (right  of center)
const bLeft       = s => left  ((1 + s) / 2) // Left   border (bottom of center)
const bRight      = s => right ((1 + s) / 2) // Right  border (bottom of center)
const lTop        = s => top   ((1 - s) / 2) // Top    border (left   of center)
const lBottom     = s => bottom((1 - s) / 2) // Bottom border (left   of center)
const tLeft       = s => left  ((1 - s) / 2) // Left   border (top    of center)
const tRight      = s => right ((1 - s) / 2) // Right  border (top    of center)

const Rectangle = {
  top       : [ topLeft    ,  topRight   ,  right   ,  left  ],
  bottom    : [ bottomRight,  bottomLeft , oLeft    , oRight ],
  left      : [ topLeft    ,  bottomLeft ,  bottom  ,  top   ],
  right     : [ topRight   ,  bottomRight, oBottom  , oTop   ],
  vertical  : [rTop        , rBottom     , lBottom  , lTop   ],
  horizontal: [tLeft       , tRight      , bRight   , bLeft  ],
}

const Diagonal = {
  asc : [topRight, right ,  bottom, bottomLeft , oLeft  , oTop ],
  desc: [topLeft , top   , oRight , bottomRight, oBottom,  left],
}

const Triangle = {
  topLeft    : [topLeft    ,  top   , left  ],
  topRight   : [topRight   , oTop   , right ],
  bottomLeft : [bottomLeft , oBottom, oLeft ],
  bottomRight: [bottomRight,  bottom, oRight],
}

const v  = s => [1/2, s  ] // Vertical
const h  = s => [s  , 1/2] // Horizontal
const d1 = s => v(s - 1/2) // Diamond point 1
const d2 = s => h(3/2 - s) // Diamond point 2
const d3 = s => v(3/2 - s) // Diamond point 3
const d4 = s => h(s - 1/2) // Diamond point 4
const Diamond = {
  diamond: [d1, d2, d3, d4],
}

const toString = poly =>
  'polygon('
  + poly.map(pt => pt.map(c => c * 100 + '%').join(' ')).join(',')
  + ')'
const mergeObj = compose(mergeAll, values)
const evolve   = map(_ => compose(toString, ap(_), _ => [_]))

export default compose(evolve, mergeObj)({
  Rectangle,
  Diagonal,
  Triangle,
  Diamond,
})
