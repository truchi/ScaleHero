// @flow
import type {
  Accumulator,
  Reducer,
  Updater,
  Getter,
  Setter,
} from './Tree.types'
import {
  addIndex,
  adjust,
  append,
  compose as c,
  path,
  reduce as r,
  splitAt,
  when,
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

/**
 * Updates a tree recursively to its children,
 * applying at each level a callback before and after the setter of the children,
 * traversing top to bottom, left to right
 * @kind Updater before, Updater after, Getter get, Setter set, Tree tree ->
 *         Tree tree
 */
export const update: (Updater, Updater, Getter, Setter, Tree) => Updater =
  (
    before: Updater, // A function to call before
    after : Updater, // A function to call after
    get   : Getter,  // A function getting the children
    set   : Setter,  // A function setting children
  ): ((Tree) => Updater) =>
    (
      tree: Tree, // The tree to update
    ): Updater =>
      c(
        path([0, 0]), // after reduce, stack is [[tree]]
        reduce(
          // Before
          // Push current item (previous's child) into last's acc (current's parent)
          (
            acc    : Tree[][], // stack of children
            tree   : Tree,     // current item
            indexes: number[], // indexes
          ): Tree[][] =>
            ((
              tree: Tree, // updated current item
            ): Tree[][] =>
              c(
                append([]),              // append new array for current's children
                adjust(-1, append(tree)) // append current into last's acc
              )(acc)
            )(before(tree, indexes)), // call before with current item

          // After
          // Push acc's last (current's children)
          // into last's (current item) acc's second to last (children of current's parent)
          (
            acc    : Tree[][], // stack of children
            tree   : Tree,     // current item
            indexes: number[], // indexes
          ): Tree[][] =>
            ((
              [
                acc: Tree[], // stack before current
                [
                  children: Tree[], // current's children
                ]
              ]
            ): Tree[] =>
              adjust(   // adjust
                -1,     // parent's children
                adjust( // adjust
                  -1,   // current
                  c(
                    _ => after(_, indexes),          // call after with current item
                    when(
                      _ => children.length,          // when children
                      _ => set(_, children, indexes) // set current's children
                    )
                  )
                )
              )(acc)
            )(splitAt(-1, acc)), // split at last children

          // Get
          get
        )
      )(
        [[]], // empty stack
        tree  // tree to update
      )

export default {
  reduce,
  update,
}
