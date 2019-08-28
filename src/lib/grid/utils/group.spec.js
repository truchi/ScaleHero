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
    [{ index: { section: 0, line: 0, bar: 0, item: 0 }, duration: 1, chord: 'A' }]
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
        index: { section: 0, line: 0, bar: 0, item: undefined },
        count: 2,
        repeat: [
          { index: { section: 0, line: 0, bar: 0, item: 0 }, duration: 1, chord: 'A' },
          { index: { section: 0, line: 1, bar: 0, item: 0 }, duration: 1, chord: 'B' }
        ]
      },
      {
        index: { section: 0, line: 2, bar: 0, item: undefined },
        count: 2,
        repeat: [
          { index: { section: 0, line: 2, bar: 0, item: 0 }, duration: 1, chord: 'C' },
          { index: { section: 1, line: 0, bar: 0, item: 0 }, duration: 1, chord: 'D' },
          { index: { section: 1, line: 1, bar: 0, item: 0 }, duration: 1, chord: 'E' }
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
        index: { section: undefined, line: undefined, bar: undefined, item: undefined },
        count: 2,
        repeat: [
          {
            index: { section: 0, line: undefined, bar: undefined, item: undefined },
            count: 2,
            repeat: [
              {
                index: { section: 0, line: 0, bar: 0, item: undefined },
                count: 2,
                repeat: [{ index: { section: 0, line: 0, bar: 0, item: 0 }, duration: 1, chord: 'A' }]
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
