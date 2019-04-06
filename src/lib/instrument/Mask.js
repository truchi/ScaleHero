import {
  and,
  any,
  apply,
  call,
  compose,
  defaultTo,
  gte,
  lte,
  prop,
  zipWith,
} from 'ramda'

//--
//   A pair is an Array Number
//   A mask is an Array Array Pair
//
//   Specifically, it is a collection of [lower, upper] pair list
//
//   A number is inside a pair
//   if it satisfies:
//   lower <= number <= upper
//
//   A number is inside a pair list
//   if it is inside at least one of the pairs

//   A pair of numbers (i, j) are inside the mask
//   if j is inside the ith pair list
//
//   +/-Infinity are valid bounds
//
//   @example [
//     [[-Infinity, Infinity]],
//     [[1, 3], [7, 9], [13, 15]]
//   ]
//--

//** Returns wether i is in pair
//:: Number i, Pair pair -> Boolean inside
const insidePair =
  i =>
    compose(
      apply(and),  // both
      zipWith(
        call,
        [
          gte(i),  // i >= lower bound
          lte(i)   // i <= upper bound
        ]
      )
    )

//** Returns wether i is in at least one of the pairs
//:: Number i -> Array Pair pairs -> Boolean inside
const insidePairs =
  i =>
    any(insidePair(i))

//** Returns wether j is in mask's ith pair list
//:: Number i, Number j, Mask mask -> Boolean inside
const inside =
  i =>
    j =>
      compose(insidePairs(j), defaultTo([]), prop(i))

//** Returns wether j is in any masks's ith pair list
//:: Number i -> Number j -> Array masks -> Boolean inside
const insideAny =
  i =>
    j =>
      compose(any(inside(i)(j)), defaultTo([]))

export default {
  inside,
  insideAny,
}
