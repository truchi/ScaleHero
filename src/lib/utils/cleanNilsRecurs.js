import {
  is,
  isNil,
  map,
  pipe,
  reject,
  when,
} from 'ramda'

//** Removes nulls and undefineds recursively on object o
//:: Object o -> Object o
const cleanNilsRecurs =
  when(                      // when
    is(Object),              // value is object
    pipe(
      reject(isNil),         // remove nulls and undefineds
      map(_ => cleanNilsRecurs(_)) // and recurse on children
    )
  )

export default cleanNilsRecurs
