import base from './base'

//--
//   A note is a String denoting its name
//   in the form: A|B|C|D|E|F|G[b|#]
//
//   Its value is the corresponding number
//   of semitone(s) for name
//
//   @examples 'C', 'G#', 'Bb'
//
//   @see ./base.js
//--

const Note = base({
  'Cb': 11, 'C':  0, 'C#':  1,
  'Db':  1, 'D':  2, 'D#':  3,
  'Eb':  3, 'E':  4, 'E#':  5,
  'Fb':  4, 'F':  5, 'F#':  6,
  'Gb':  6, 'G':  7, 'G#':  8,
  'Ab':  8, 'A':  9, 'A#': 10,
  'Bb': 10, 'B': 11, 'B#':  0,
})

export default Note
