import * as R from 'ramda'

export const VALUES = {
  'Cb': 11, 'C':  0, 'C#':  1,
  'Db':  1, 'D':  2, 'D#':  3,
  'Eb':  3, 'E':  4, 'E#':  5,
  'Fb':  4, 'F':  5, 'F#':  6,
  'Gb':  6, 'G':  7, 'G#':  8,
  'Ab':  8, 'A':  9, 'A#': 10,
  'Bb': 10, 'B': 11, 'B#':  0,
}

export const NAMES = R.map(R.head, R.values(R.invert(VALUES)))

export const N = NAMES.length

// Number value -> String name
export const name = name => NAMES[R.mathMod(name, N)]

// String name -> Number value
export const value = value => VALUES[value]

// (Number value, String name) -> String newName
export const add = (v, n) => name(value(n) + v)
