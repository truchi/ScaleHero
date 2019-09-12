// @flow
import type {
  Accumulator,
  Reducer,
  Getter,
} from './Tree.types'
import {
  addIndex,
  append,
  reduce as r,
} from 'ramda'

/**
 * Reduces a tree recursively to its children,
 * applying at each level a callback before and after the reducer,
 * traversing top to bottom, left to right
 * @kind Reducer before, Reducer after, Getter get ->
 *         Accumulator acc, Tree tree, ?number[] indexes ->
 *           Accumulator acc
 */
export const reduce: (Reducer, Reducer, Getter) => Reducer =
  (
    before: Reducer, // A function to call before the reducer
    after : Reducer, // A function to call after  the reducer
    get   : Getter,  // A function getting the children
  ): Reducer =>
    (
      acc    : Accumulator,   // The initial (or current) accumulator
      tree   : Tree,          // The initial (or current) tree to reduce
      indexes: ?number[] = [] // The initial (or current) indexes
    ): Accumulator =>
      ((
        children: Tree[],      // tree's children
        acc     : Accumulator, // accumulator after applying before function
        reducer : Reducer,     // recursive reducer
      ): Accumulator =>
        ((
          acc: Accumulator // accumulator after reduce
        ): Accumulator =>
          // Apply after function
          after(acc, tree, indexes)
        )(
          children
            // reduce trees (recursively)
            ? addIndex(r)(
              (acc, tree, i) =>
                // Append current index to indexes
                reducer(acc, tree, append(i, indexes)),
              acc,
              children
            )
            // nothing to reduce
            : acc
        )
      )(
        get(tree, indexes),         // retrieving children
        before(acc, tree, indexes), // applying before on
        reduce(before, after, get)  // initialyzing reducer
      )

export default {
  reduce,
}
