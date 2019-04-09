import {
  merge,
  reduce,
} from 'ramda'

//** Logs scoped arguments and own argument and returns own argument
//:: (...args) -> arg -> arg
const debug =
  (...args) =>
    arg =>
      console.log(...args, arg) || arg

// Retuns an object from entries ([[key, val], ...])
//:: Array entries -> Object o
const fromEntries =
  reduce(
    (o, [key, val]) =>
      merge(o, { [key]: val }),
    {}
  )

//--
//   Patches
//--
Object.fromEntries = fromEntries
window.__D = debug
