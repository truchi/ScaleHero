import BaseItem from './BaseItem'

const N     = BaseItem.N
const M     = BaseItem.M
const FLAT  = BaseItem.FLAT
const SHARP = BaseItem.SHARP
const N2H   = { '1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11 }
const H2N   = [
         `1`
, `${FLAT}2`
,        `2`
, `${FLAT}3`
,        `3`
,        `4`
, `${FLAT}5`
,        `5`
, `${FLAT}6`
,        `6`
, `${FLAT}7`
,        `7`
]

class Interval extends BaseItem {
  constructor(name = '1') {
    super(name, Interval)
  }

  clone() {
    return super.clone(Interval)
  }

  static fromHalfs(halfs) {
    return super.fromHalfs(halfs, Interval)
  }

  static _parse(full) {
    var [full, accidentals, short] = new RegExp(
      `^([${FLAT}|${SHARP}]*)(\\d*)$`
    ).exec('' + full)
    short = '' + (Interval._mod(+short - 1, M) + 1)

    return super._parse({ full, short, accidentals })
  }

  static fromNamesString(string) {
    return super.fromNamesString(string, Interval)
  }
}

Interval.N2H = N2H
Interval.H2N = H2N
export default Interval
