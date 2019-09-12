import { reduce } from './Tree'

const tree = {
  indexes: [],
  items: [
    {
      indexes: [0],
      items: [
        { indexes: [0, 0] },
        { indexes: [0, 1] },
      ]
    },
    {
      indexes: [1],
      items: [
        { indexes: [1, 0] },
        { indexes: [1, 1] },
      ]
    },
  ]
}

describe('reduce', () => {
  const jsonBefore = JSON.stringify(tree)
  const before     = (acc, item) => acc.push('b' + item.indexes.join('')) && acc
  const after      = (acc, item) => acc.push('a' + item.indexes.join('')) && acc
  const get        =       item  => item.items
  const reduced    = reduce(before, after, get)([], tree)
  const jsonAfter  = JSON.stringify(tree)

  it('reduces tree', () => {
    expect(reduced.join(' '))
      .toEqual([
        'b',
        'b0',
        'b00', 'a00',
        'b01', 'a01',
        'a0',
        'b1',
        'b10', 'a10',
        'b11', 'a11',
        'a1',
        'a',
      ].join(' '))
  })

  it('gives correct indexes', () => {
    const before  = (acc, { indexes        }, idxs) => ((expect(indexes.join('')).toEqual(idxs.join('')), acc))
    const after   = (acc, { indexes        }, idxs) => ((expect(indexes.join('')).toEqual(idxs.join('')), acc))
    const get     = (     { indexes, items }, idxs) => ((expect(indexes.join('')).toEqual(idxs.join('')), items || []))

    reduce(before, after, get)(null, tree)
  })

  it('does not modify original tree', () => expect(jsonBefore).toEqual(jsonAfter))
})
