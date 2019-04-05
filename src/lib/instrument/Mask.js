import {
} from 'ramda'

// (Array mask, Number i, Number j) -> Boolean inside
const inside = (mask, i, j) =>
  mask[i] && (-1 !== mask[i].findIndex(([min, max]) => min <= j && j <= max))

// (Array masks, Number i, Number j) -> Boolean inside
const insideAll = (masks, i, j) =>
  masks.length
    ? -1 !== masks.findIndex(mask => inside(mask, i, j))
    : true

const Mask = {
  inside,
  insideAll,
}

// export { { ...Mask } }

export default Mask
