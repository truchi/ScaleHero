import { reduce, update } from './Tree'

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

describe('update', () => {
  const jsonBefore = JSON.stringify(tree)
  const before     = item => Object.assign({ before: 'before' }, item)
  const after      = item => Object.assign({ after : 'after'  }, item)
  const get        = item => item.items || []
  const set        = (parent, items) => Object.assign({}, parent, { items })
  const updated    = update(before, after, get, set)(tree)
  const jsonAfter  = JSON.stringify(tree)

  it('updates tree', () => {
    const test = node => {
      expect(node.before).toEqual('before')
      expect(node.after ).toEqual('after')

      if (node.items) node.items.map(test)
    }

    test(updated)
  })

  it('gives correct indexes', () => {
    const before  = (item,           idxs) => ((expect(item.indexes.join('')).toEqual(idxs.join('')), item))
    const after   = (item,           idxs) => ((expect(item.indexes.join('')).toEqual(idxs.join('')), item))
    const get     = (item,           idxs) => ((expect(item.indexes.join('')).toEqual(idxs.join('')), item.items || []))
    const set     = (item, children, idxs) => ((expect(item.indexes.join('')).toEqual(idxs.join('')), item.items = children, item))

    update(before, after, get, set)(tree)
  })

  it('does not modify original tree', () => expect(jsonBefore).toEqual(jsonAfter))
})
