import group from './group'

const pairs = {
  "an empty grid": [
    // Empty grid
    {},
    // Expected
    []
  ],
  "a grid without any repeats": [
    // Grid with no repeats
    {
      sections: [{
        lines: [{
          bars: [{ items: [{ duration: 1, chord: 'A' }] }]
        }]
      }]
    },
    // Expected
    [{ index: [0, 0, 0, 0], duration: 1, chord: 'A' }]
  ],
  "repeats across bars, lines and sections": [
    // Grid with repeats across sections and lines
    {
      sections: [
        {
          lines: [
            { bars: [{ items: [{ duration: 1, chord: 'A' }], repeat: true }] },
            { bars: [{ items: [{ duration: 1, chord: 'B' }], count : 2    }] },
            { bars: [{ items: [{ duration: 1, chord: 'C' }], repeat: true }] },
          ]
        },
        {
          lines: [
            { bars: [{ items: [{ duration: 1, chord: 'D' }]               }] },
            { bars: [{ items: [{ duration: 1, chord: 'E' }], count : 2    }] },
          ]
        }
      ]
    },
    // Expected
    [
      {
        index: [0, 0, 0],
        count: 2,
        repeat: [
          { index: [0, 0, 0, 0], duration: 1, chord: 'A' },
          { index: [0, 1, 0, 0], duration: 1, chord: 'B' }
        ]
      },
      {
        index: { section: 0, line: 2, bar: 0, item: undefined },
        count: 2,
        repeat: [
          { index: [0, 2, 0, 0], duration: 1, chord: 'C' },
          { index: [1, 0, 0, 0], duration: 1, chord: 'D' },
          { index: [1, 1, 0, 0], duration: 1, chord: 'E' }
        ]
      }
    ]
  ],
  "repeats around grid, sections and bars": [
    // Grid with section, line and bar repeats
    {
      repeat: true,
      count: 2,
      sections: [{
        repeat: true,
        count: 2,
        lines: [{
          bars: [{ repeat: true, count: 2, items: [{ duration: 1, chord: 'A' }] }]
        }]
      }]
    },
    // Expected
    [
      {
        index: [],
        count: 2,
        repeat: [
          {
            index: [0],
            count: 2,
            repeat: [
              {
                index: [0, 0, 0],
                count: 2,
                repeat: [{ index: [0, 0, 0, 0], duration: 1, chord: 'A' }]
              }
            ]
          }
        ]
      }
    ]
  ]
}

describe('groups correctly', () =>
  test
    .each(
      Object.entries(pairs).map(([name, [tree, expected]]) => [name, tree, expected])
    )(
      'with %s',
      (name, tree, expected) =>
        expect(
          JSON.stringify(group(tree))
        ).toEqual(
          JSON.stringify(expected)
        )
    )
)
