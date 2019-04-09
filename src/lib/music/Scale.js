import Note     from './Note'
import Interval from './Interval'
import {
  __,
  compose,
  equals,
  find,
  map,
} from 'ramda'

//--
//   A scale is an Array Interval
//
//   @example ['1', '2', 'b3', '4', '5', 'b6', 'b7']
//
//   @see ./Interval.js
//--

//** Returns notes of intervals to root
//:: String root -> Array String intervals -> Array String notes
const notes =
  root =>
    map(                    // for each interval
      compose(
        Note.add(__, root), // add to root the
        Interval.value      // interval's value
      )
    )

//** Returns interval from intervals which gives note to root
//   or undefined when note is not in scale with root
//:: String root -> String note -> Scale scale -> String? interval
const getInterval =
  root =>
    note =>
      find(                         // first scale's interval where
        compose(
          equals(Note.value(note)), // note's value equals
          Note.value,               // value of
          Note.add(__, root),       // root plus
          Interval.value            // interval's value
        )
      )

export default {
  notes,
  getInterval,
}
