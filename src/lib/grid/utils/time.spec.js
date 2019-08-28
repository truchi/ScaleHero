import time from './time'

const group = {
  count: 4,
  repeat: [
    {
      count: 3,
      repeat: [
        { duration: 1 },
        { duration: 2 },
        {
          count: 2,
          repeat: [
            { duration: 3 }
          ]
        },
        { duration: 4 }
      ]
    }
  ]
}

const expected = {
  at: 0,
  count: 4,
  duration: 39,
  total: 156,
  repeat: [
    {
      at: 0,
      count: 3,
      duration: 13,
      total: 39,
      repeat: [
        {
          at: 0,
          count: 1,
          duration: 1,
          total: 1
        },
        {
          at: 1,
          count: 1,
          duration: 2,
          total: 2
        },
        {
          at: 3,
          count: 2,
          duration: 3,
          total: 6,
          repeat: [
            {
              at: 0,
              count: 1,
              duration: 3,
              total: 3
            }
          ]
        },
        {
          at: 9,
          count: 1,
          duration: 4,
          total: 4
        }
      ]
    }
  ]
}

it('times correctly', () =>
  expect(
    JSON.stringify(time(group))
  ).toEqual(
    JSON.stringify(expected)
  )
)
