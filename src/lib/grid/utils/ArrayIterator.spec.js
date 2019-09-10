import iterator from './ArrayIterator'

const i = iterator({
  count : 2,
  repeat: ['a', 'b', 'c']
})
const expecteds = [
  {              index: 0, count: 1 },
  { value: 'a' , index: 1, count: 1 },
  { value: 'b' , index: 2, count: 1 },
  { value: 'c' , index: 3, count: 1 },
  { value: 'a' , index: 1, count: 2 },
  { value: 'b' , index: 2, count: 2 },
  { value: 'c' , index: 3, count: 2 },
  { done : true, index: 3, count: 2 },
]

describe('::next', () => {
  it('iterates correctly and has correct cursor', () => {
    let value, done

    expecteds.map(e => {
      const { index, count } = i.cursor()

      expect(index).toEqual(e.index)
      expect(count).toEqual(e.count)

      if (value) {
        expect(value).toEqual(e.value)
        expect(done ).toBeFalsy()
      }

      if (done) {
        expect(value).toBeUndefined()
        expect(done ).toEqual(true)
      }

      ;({ value, done } = i.next())
    })
  })
})

describe('::goto', () => {
  it('moves correctly', () => {
    expecteds.map(e => {
      const { index, count } = i.goto(e).cursor()

      expect(index).toEqual(e.index)
      expect(count).toEqual(e.count)
    })
  })

  it('bounds cursor', () => {
    const last = expecteds[expecteds.length - 1]
    const { index, count } = i.goto({ index: last.index + 1, count: last.count + 1 }).cursor()

    expect(index).toEqual(last.index)
    expect(count).toEqual(last.count)
  })
})
