import base from './base'

//--
//   An interval is a String denoting its name
//   in the form: 1|2|3|4|5|6|7[bb|b|#]
//
//   Its value is the corresponding number
//   of semitone(s) for name
//
//   @examples '1', '#2', 'bb7'
//
//   @see ./base.js
//--

const Interval = base({
                      '1':  0,
            'b2':  1, '2':  2, '#2': 3,
            'b3':  3, '3':  4,
            'b4':  4, '4':  5, '#4': 6,
            'b5':  6, '5':  7, '#5': 8,
            'b6':  8, '6':  9,
  'bb7': 9, 'b7': 10, '7': 11,
})

export default Interval
