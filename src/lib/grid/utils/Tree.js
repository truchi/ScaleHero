// @flow
import {
  __,
  addIndex,
  adjust,
  append,
  compose as c,
  evolve,
  path,
  reduce as r,
  splitAt,
  when,
} from 'ramda'

/** Item type */
type Item = Object

/** Accumulator type */
type Accumulator = any

/** Reducer type */
type Reducer = (Accumulator, Item, ?number[]) => Accumulator

/** Updater type */
type Updater = (Item, ?number[]) => Item

/** Getter type */
type Getter = (Item, ?number[]) => Item[]

// TODO spec indexes

/**
 * Reduces a tree recursively to its children,
 * applying at each level a callback before and after the reducer,
 * traversing top to bottom, left to right
 * @kind Reducer before, Reducer after, Getter get ->
 *         Accumulator acc, Item item, ?number[] indexes ->
 *           Accumulator acc
 */
export const reduce =
  (
    before: Reducer, // A function to call before the reducer (passed acc and item)
    after : Reducer, // A function to call after  the reducer (passed acc and item)
    get   : Getter,  // A function returning the children     (passed item)
  ): Reducer =>
    (
      acc : Accumulator, // The initial (or current) accumulator
      item: Item,        // The initial (or current) item
      idxs: ?number[] = []
    ): Accumulator =>
      ((
        items  : Item[],      // item's children
        acc    : Accumulator, // accumulator after applying before function
        reducer: Reducer,     // recursive reducer
      ): Accumulator =>
        ((
          acc: Accumulator // accumulator after reduce
        ): Accumulator =>
          after(acc, item, idxs) // Apply after function
        )(
          items
            // (has children) reduce items (recursively)
            ? addIndex(r)(
              (acc, item, i) => reducer(acc, item, append(i, idxs)),
              acc,
              items
            )
            // (no  children) nothing to reduce
            : acc
        )
      )(
        get(item, idxs),                    // retrieving children
        before(acc, item, idxs),            // applying before on
        reduce(before, after, get) // initialyzing reducer
      )

export const update =
  (before, after, get, set) =>
    (item) =>
      c(
        path([0, 'children', 0]),
        reduce(
          // Before
          (acc, item, idxs) =>
            (item =>
              c(
                append({ children: [] }),
                adjust(-1, evolve({ children: append(item) }))
              )(acc)
            )(before(item, idxs)),
          // After
          (acc, item, idxs) =>
            (([acc, [{ children }]]) =>
              adjust(
                -1,
                evolve({
                  children: adjust(
                    -1,
                    c(
                      after(__, idxs),
                      when(
                        _ => children.length,
                        set(__, children, idxs)
                      )
                    )
                  )
                })
              )(acc)
            )(splitAt(-1, acc)),
          // Get
          get
        )
      )(
        [{ children: [] }],
        item
      )
