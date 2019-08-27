// @flow

/** Tree type */
export type Tree = Object

/** Accumulator type */
export type Accumulator = any

/** Getter type */
export type Getter = (Tree, ?number[]) => Tree[]

/** Setter type */
export type Setter = (Tree, Tree[], ?number[]) => Tree[]

/** Reducer type */
export type Reducer = (Accumulator, Tree, ?number[]) => Accumulator

/** Updater type */
export type Updater = (Tree, ?number[]) => Item
