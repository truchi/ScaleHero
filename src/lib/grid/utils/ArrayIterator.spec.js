import iterator from './ArrayIterator'

const i = iterator({
  count : 2,
  repeat: ['a', 'b', 'c']
})
const expecteds = ['a', 'b', 'c', 'a', 'b', 'c', undefined]

it('iterates correctly', () => {
  expecteds.map(e => {
    const { value, done } = i.next()

    if (e.value) {
      expect(value).toEqual(e.value)
      expect(done ).toBeFalsy()
    } else {
      expect(value).toBeUndefined()
      expect(done ).toEqual(true)
    }
  })
})
