// @flow

/** Repeatable type */
type Repeatable = {|
  repeat?: true,
  count ?: number,
|}

/** Event type */
export type Event = {|
  data: {
    duration: number,
    // Will have some other data here
  }
|}

/** Bar type */
export type Bar = {|
  ...Repeatable,
  ...{|
    elems: Event[],
  |}
|}

/** Line type */
export type Line = {|
  ...Repeatable,
  ...{|
    bars: Bar[],
  |}
|}

/** Section type */
export type Section = {|
  ...Repeatable,
  ...{|
    name?: string,
    lines: Line[],
  |}
|}

/** Grid type */
export type Grid = {|
  ...Repeatable,
  ...{|
    sections: Section[],
  |}
|}
