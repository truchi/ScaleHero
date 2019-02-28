export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const randomItem = (arr) =>
  arr[randomInt(0, arr.length - 1)]
