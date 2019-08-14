// @flow
import {
  reduce,
} from 'ramda'

/** Item type */
type Item = Object

/** Accumulator type */
type Accumulator = any

/** Reducer type */
type Reducer = (Accumulator, Item) => Accumulator

/** Getter type */
type Getter = (Item) => Item[]

/**
 * Reduces a tree recursively to its children,
 * applying at each level a callback before and after the reducer,
 * traversing top to bottom, left to right
 * @kind Reducer before, Reducer after, Getter get ->
 *         Accumulator acc, Item item ->
 *           Accumulator acc
 */
const recursiveReduce =
  (
    before: Reducer, // A function to call before the reducer (passed acc and item)
    after : Reducer, // A function to call after  the reducer (passed acc and item)
    get   : Getter,  // A function returning the children     (passed item)
  ): Reducer =>
    (
      acc : Accumulator, // The initial (or current) accumulator
      item: Item,        // The initial (or current) item
    ): Accumulator =>
      ((
        items  : Item[],      // item's children
        acc    : Accumulator, // accumulator after applying before function
        reducer: Reducer,     // recursive reducer
      ): Accumulator =>
        ((
          acc: Accumulator // accumulator after reduce
        ): Accumulator =>
          after(acc, item) // Apply after function
        )(
          items
            ? reduce(reducer, acc, items) // (has children) reduce items (recursively)
            : acc                         // (no  children) nothing to reduce
        )
      )(
        get(item),                          // retrieving children
        before(acc, item),                  // applying before on
        recursiveReduce(before, after, get) // initialyzing reducer
      )

export default recursiveReduce
