import BaseItem from './BaseItem'

const N     = BaseItem.N
const M     = BaseItem.M
const FLAT  = BaseItem.FLAT
const SHARP = BaseItem.SHARP
const N2H   = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 }
const H2N   = [
  `C`
, `C${SHARP}`
, `D`
, `D${SHARP}`
, `E`
, `F`
, `F${SHARP}`
, `G`
, `G${SHARP}`
, `A`
, `A${SHARP}`
, `B`
]

class Note extends BaseItem {
  constructor(name = 'C') {
    super(name, Note)
  }

  clone() {
    return super.clone(Note)
  }

  static fromHalfs(halfs) {
    return super.fromHalfs(halfs, Note)
  }

  static _parse(full) {
    var [full, short, accidentals] = new RegExp(
      `^(${Object.keys(N2H).join('|')})([${FLAT}|${SHARP}]*)$`
    ).exec(full.toUpperCase())

    return super._parse({ full, short, accidentals })
  }

  static fromNamesString(string) {
    return super.fromNamesString(string, Note)
  }
}

Note.N2H = N2H
Note.H2N = H2N
export default Note
