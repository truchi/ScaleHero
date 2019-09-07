export const itWorks = () => {
  const total = 46
  const str   = (i) =>
    [
      ['i', 0],
      ['t', 3],
      ['w', 9],
      ['o', 14],
      ['r', 18],
      ['k', 22],
      ['s', 26],
      ['exl', 28],
      ['exl', 30],
      ['exl', 32],
    ].map(([c, j]) => [c, 7 + j - i])

  return {
    bpm: 400,
    state: [{
      type: 'guitar',
      tuning: 1,
      from  : 0,
      to    : 12,
      layers: [
        {
          palette: 1,
          root   : 'C',
          scale  : 2,
        },
        ...str(0).map(
          ([c, j]) =>
            ({
              clips  : [0, 1, 2, 3],
              masking: [{ mask: c, offsetJ: j }],
              palette: 0,
              root   : 'C',
              scale  : 2,
            })
        )
      ],
    }],
    grid: {
      sections: [
        {
          lines: [
            {
              bars: [
                { items: [{ duration: total, chord: 'D' }] },
              ]
            },
          ]
        },
      ]
    },
    timelines: [
      {
        sections: [
          {
            lines: [
              {
                bars: [...Array(total).keys()].map(
                  time =>
                    ({
                      items: [{
                        duration: 1,
                        events: str(time).map(
                          ([c, i], mask) =>
                            ({ path: [0, 'layers', mask + 1, 'masking', 0, 'offsetJ'], value: i })
                        )
                      }]
                    })
                )
              },
            ]
          },
        ]
      }
    ],
    masks: {
      i: [
        [],
        [[6, 6]],
        [[6, 6]],
        [[6, 6]],
        [[6, 6]],
        [],
      ],
      t: [
        [],
        [[5, 7]],
        [[6, 6]],
        [[6, 6]],
        [[6, 6]],
        [],
      ],
      w: [
        [],
        [[4, 4], [8, 8]],
        [[4, 4], [8, 8]],
        [[4, 4], [6, 6], [8, 8]],
        [[5, 5], [7, 7]],
        [],
      ],
      o: [
        [],
        [[6, 6]],
        [[5, 5], [7, 7]],
        [[5, 5], [7, 7]],
        [[6, 6]],
        [],
      ],
      r: [
        [],
        [[5, 7]],
        [[5, 5], [7, 7]],
        [[5, 6]],
        [[5, 5], [7, 7]],
        [],
      ],
      k: [
        [],
        [[5, 5], [7, 7]],
        [[5, 6]],
        [[5, 6]],
        [[5, 5], [7, 7]],
        [],
      ],
      s: [
        [],
        [[5, 6]],
        [[5, 5]],
        [[6, 6]],
        [[5, 6]],
        [],
      ],
      exl: [
        [],
        [[6, 6]],
        [[6, 6]],
        [],
        [[6, 6]],
        [],
      ],
    }
  }
}
