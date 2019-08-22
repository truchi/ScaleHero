import { reduce, update } from './Tree'

const tree = {
  data: 1,
  items: [
    {
      data: 11,
      items: [
        { data: 111 },
        { data: 112 },
      ]
    },
    {
      data: 12,
      items: [
        { data: 121 },
        { data: 122 },
      ]
    },
  ]
}

const before  = (acc, item) => acc.push('b' + item.data) && acc
const after   = (acc, item) => acc.push('a' + item.data) && acc
const get     = item        => item.items
const reduced = reduce(before, after, get)([], tree)

it('traverses tree', () =>
  expect(reduced.join(' '))
   .toEqual([
     'b1',
     'b11',
     'b111', 'a111',
     'b112', 'a112',
     'a11',
     'b12',
     'b121', 'a121',
     'b122', 'a122',
     'a12',
     'a1',
   ].join(' '))
)
