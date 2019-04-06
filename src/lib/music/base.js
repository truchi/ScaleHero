import {
  add as plus,
  compose,
  curry,
  invertObj,
  mathMod,
  uncurryN,
} from 'ramda'

//--
//   Mixin for Note and Interval
//
//   @see ./Note.js, ./Interval.js
//--

//** Number of notes in octave
//:: Number
const N = 12

export default VALUES => {
  //** Name to value mapping
  //:: Object Number
  // VALUES

  //** Value to name mapping
  //   (last name found in VALUES for value is prefered)
  //:: Array String
  const NAMES = invertObj(VALUES)

  //** Returns name of value
  //:: Number value -> String name
  const name =
    value =>
      NAMES[mathMod(value, N)]

  //** Returns value of name
  //:: String name -> Number value
  const value =
    name =>
      VALUES[name]

  //** Returns name of name + value
  //:: Number value -> String name -> String newName
  const add = curry(uncurryN(2,
    v =>
      compose(
        name,    // get name of
        plus(v), // value plus
        value    // name's value
      )
  ))

  return {
    VALUES,
    NAMES,
    name,
    value,
    add,
  }
}

