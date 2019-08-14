import flatten from './flatten'

// (((A B C C D) x2) E) x2) x2
const flat = flatten({
  repeat  : true,
  count   : 2,
  sections: [
    {
      repeat: true,
      count : 2,
      lines : [
        {
          bars: [
            { repeat: true          , elems: [{ data: { duration: 1, chord: 'A' } }, { data: { duration: 1, chord: 'B' } }] },
            { repeat: true, count: 2, elems: [{ data: { duration: 1, chord: 'C' } }] },
            {               count: 2, elems: [{ data: { duration: 1, chord: 'D' } }] },
            {                         elems: [{ data: { duration: 1, chord: 'E' } }] },
          ]
        },
      ]
    },
  ]
})

const items = {
  grid   : flat[ 0],
  section: flat[ 1],
  bar1   : flat[ 2],
  a      : flat[ 3],
  b      : flat[ 4],
  bar2   : flat[ 5],
  c      : flat[ 6],
  d      : flat[ 8],
  e      : flat[10],
}

const repeats = {
  begin              : { 0: 1, 1: 1, 2: 1, 5: 1 },
  bar2               : { 0: 1, 1: 1, 2: 1, 5: 2 },
  bar1               : { 0: 1, 1: 1, 2: 2, 5: 1 },
  bar1Bar2           : { 0: 1, 1: 1, 2: 2, 5: 2 },
  section            : { 0: 1, 1: 2, 2: 1, 5: 1 },
  sectionBar2        : { 0: 1, 1: 2, 2: 1, 5: 2 },
  sectionBar1        : { 0: 2, 1: 1, 2: 2, 5: 1 },
  sectionBar1Bar2    : { 0: 2, 1: 1, 2: 2, 5: 2 },
  grid               : { 0: 2, 1: 1, 2: 1, 5: 1 },
  gridBar2           : { 0: 2, 1: 1, 2: 1, 5: 2 },
  gridBar1           : { 0: 2, 1: 1, 2: 2, 5: 1 },
  gridBar1Bar2       : { 0: 2, 1: 1, 2: 2, 5: 2 },
  gridSection        : { 0: 2, 1: 2, 2: 1, 5: 1 },
  gridSectionBar2    : { 0: 2, 1: 2, 2: 1, 5: 2 },
  gridSectionBar1    : { 0: 2, 1: 2, 2: 2, 5: 1 },
  gridSectionBar1Bar2: { 0: 2, 1: 2, 2: 2, 5: 2 },
}

it('returns an array', () =>
  expect(Array.isArray(flat)).toEqual(true)
)

it('has the correct length', () =>
  expect(flat.length).toEqual(13) // 5 items + 4 starts + 4 ends
)

it('flattens the grid', () => {
  expect(flat[ 0].repeat).not.toBeUndefined()
  expect(flat[ 1].repeat).not.toBeUndefined()
  expect(flat[ 2].repeat).not.toBeUndefined()
  expect(flat[ 3].data  ).not.toBeUndefined()
  expect(flat[ 4].data  ).not.toBeUndefined()
  expect(flat[ 5].repeat).not.toBeUndefined()
  expect(flat[ 6].data  ).not.toBeUndefined()
  expect(flat[ 7].from  ).not.toBeUndefined()
  expect(flat[ 8].data  ).not.toBeUndefined()
  expect(flat[ 9].from  ).not.toBeUndefined()
  expect(flat[10].data  ).not.toBeUndefined()
  expect(flat[11].from  ).not.toBeUndefined()
  expect(flat[12].from  ).not.toBeUndefined()
})

it('computes correct durations', () => {
  expect(flat[0].duration).toEqual(22)
  expect(flat[1].duration).toEqual(11)
  expect(flat[2].duration).toEqual( 5)
  expect(flat[5].duration).toEqual( 1)
})

describe('At functions', () => {
  Object.entries(repeats).map(([repeat, repeats]) => {
    const gridAt    = items.grid   .at(repeats)
    const sectionAt = items.section.at(repeats)
    const bar1At    = items.bar1   .at(repeats)
    const aAt       = items.a      .at(repeats)
    const bar2At    = items.bar2   .at(repeats)
    const cAt       = items.c      .at(repeats)

    console.log('---')
    console.log(repeat)
    console.log(gridAt)
    console.log(sectionAt)
    console.log(bar1At)
    console.log(aAt)
    console.log(bar2At)
    console.log(cAt)

    it(`returns the same for repeats start items and first data (${ repeat })`, () => {
      expect(gridAt).toEqual(sectionAt)
      expect(gridAt).toEqual(gridAt)
      expect(gridAt).toEqual(bar1At)
      expect(gridAt).toEqual(aAt)

      expect(bar2At).toEqual(cAt)
    })
  })
})
