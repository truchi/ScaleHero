import Clip     from '../lib/clip'
import Textures from '../lib/textures'

export const bpm = 200

export const grid = {
  repeat: true,
  count: 2,
  sections: [
    {
      repeat: true,
      count: 2,
      lines: [
        {
          bars: [
            // { repeat: true          , items: [{ duration: 1, chord: 'A' }, { duration: 1, chord: 'B' }] },
            // {                         items: [{ duration: 1, chord: 'A' }, { duration: 3, chord: 'B' }] },
            { repeat: true, count: 2, items: [{ duration: 1, chord: 'C' }] },
            // {               count: 2, items: [{ duration: 1, chord: 'D' }] },
            // {                         items: [{ duration: 1, chord: 'D' }] },
          ]
        },
      ]
    },
  ]
}

export const timelines = [
  {
    repeat: true,
    count: 2,
    sections: [
      {
        repeat: true,
        count: 2,
        lines: [
          {
            bars: [
              { items: [{ duration: 1, events: [{ path: [0, 'layers', 1, 'root'], value: 'D' }] }] },
              { items: [{ duration: 1, events: [{ path: [0, 'layers', 1, 'root'], value: 'E' }] }] },
            ]
          },
        ]
      },
    ]
  }
]

export const state = [
  {
    type: 'guitar',
    tuning: 1,
    // type: 'piano',
    // tuning: 0,
    from  : 0,
    to    : 12,
    layers: [
      {
        palette: 1,
        root   : 'C',
        scale  : 2,
      },
      {
        clips  : [0, 1, 2, 3],
        masking: [{ mask: 0, offsetI: 0, offsetJ: 0 }],
        palette: 0,
        root   : 'C',
        scale  : 2,
      },
      {
        clips  : [4],
        // masks  : [0],
        palette: 0,
        root   : 'C',
        scale  : 0,
      },
    ],
  },
]

const intervals = [
  '1', 'b2', '2', '#2', 'b3', '3', 'b4', '4',
  '#4', 'b5', '5', '#5', 'b6', '6', 'bb7', 'b7', '7'
]

export const tunings = [
  ['C'],
  ['E', 'A', 'D', 'G', 'B', 'E'],
]

export const palettes = [
  Object.fromEntries(
    intervals.map(
      (i, ind) =>
        [i, {
          backgroundImage: Textures({
            type: ['lines', 'circles', 'paths'][ind % 3],
            d: 'crosses',
            stroke: `hsl(${ 360 * (ind + intervals.length / 2) / intervals.length }, 100%, 50%)`,
            fill  : `hsl(${ 360 * (ind + intervals.length / 2) / intervals.length }, 100%, 50%)`,
            lighter: true,
            thicker: true,
            opacity: .6,
          }),
          backgroundColor: `hsl(${ 360 * ind / intervals.length }, 50%, 50%)`,
          borderRadius: ind % 3 === 0 ? '25%' : 0,
          borderColor: '#EEE',
          borderStyle: 'solid',
          borderWidth: '1px',
        }]
    )
  ),
  Object.fromEntries(
    intervals.map(i => [i, { backgroundColor: '#111', borderRadius: '25%' }])
  ),
]

export const scales = [
  ['1', '2', '3', '4', '5', '6', '7'],
  ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'],
]

export const clips = [
  Clip.topLeft    (.5),
  Clip.topRight   (.5),
  Clip.bottomLeft (.5),
  Clip.bottomRight(.5),
  Clip.diamond    (.5),
]

export const masks = [
  [
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
  ]
]
