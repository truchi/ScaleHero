import denormalize from '../../lib/utils/denormalize'
import { GUITAR }  from '../Instrument'
import Mask        from '../../lib/mask'
import {
  Note,
  Scale,
} from '../../lib/music'
import {
  addIndex,
  compose as c,
  map,
  range,
  reverse,
} from 'ramda'

const toArray =
  ({ tuning, from, to, layers }) =>
    ((frets = range(from, to + 1)) =>
      map(
        ({ clips, masking, palette, root, scale }) =>
          addIndex(map)(
            (open, string) =>
              map(
                (fret) =>
                  Mask.insideAny(string)(from + fret)(masking)
                    ? ((note = Note.add(fret)(open)) => ({
                        clips,
                        style: palette[Scale.getInterval(root)(note)(scale)]
                      }))()
                    : {},
                frets
              ),
            reverse(tuning)
          ),
        layers
      )
    )()

export default
  (state) =>
    (instrument) =>
      (({ type, from } = instrument) =>
        ({
          type,
          open  : type === GUITAR && from === 0,
          layers: c(
            toArray,
            denormalize(state, {
              tuning : 'tunings',
              clip   : 'clips',
              mask   : 'masks',
              palette: 'palettes',
              scale  : 'scales',
            })
          )(instrument)
        })
      )()
