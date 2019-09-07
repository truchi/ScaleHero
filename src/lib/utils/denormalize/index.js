import {
  compose,
  is,
  map,
  mapObjIndexed,
} from 'ramda'

const mapObj = fn => mapObjIndexed((value, key) => fn(key)(value))

const denormalizeValue =
  (data, map) =>
    (key) =>
      (value) =>
        is(Array , value)          ? denormalizeArray (data, map)(key)(value)
      : is(Object, value)          ? denormalizeObject(data, map)(value)
      : map[key] && data[map[key]] ? data[map[key]][value]
      : data[key]                  ? data[key][value]
                                   : value

const denormalizeArray =
  (data, m) =>
    compose(map, denormalizeValue(data, m))

const denormalizeObject =
  (data, map = {}) =>
    mapObj(denormalizeValue(data, map))

export default denormalizeObject
