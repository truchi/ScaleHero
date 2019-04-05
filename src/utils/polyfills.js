import { debug } from '.'

//
Object.fromEntries = (iterable) =>
  [...iterable]
  .reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {})

//
Array.prototype.flat = function() { return [].concat(...this) }

//
window.__D = debug
