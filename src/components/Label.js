import React, { Component } from 'react'
import MuJS from 'mujs'

const FLAT  = MuJS.symbols.ACCS.flat
const NAT   = MuJS.symbols.ACCS.natural
const SHARP = MuJS.symbols.ACCS.sharp
const Accs = {}
Accs[FLAT ] = <span acc=''>H</span>
Accs[NAT  ] = <span acc=''>J</span>
Accs[SHARP] = <span acc=''>G</span>
let cache = {}

class Label extends Component {
  indexes(txt) {
    if (cache[txt]) {
      return cache[txt]
    }

    let indexes = []
    const l     = txt.length

    for(let acc of [ FLAT, NAT, SHARP ]) {
      for (let i = 0; i < l; ++i) {
        i = txt.indexOf(acc, i)

        if (i === -1) break
        indexes.push({ i, acc })
      }
    }

    indexes.sort((i1, i2) => i1.i - i2.i)
    cache[txt] = indexes

    return indexes
  }

  slice(txt) {
    let   slices  = []
    const indexes = this.indexes(txt)
    const l       = indexes.length

    let prev = 0
    for (let i = 0; i < l; ++i) {
      let ind = indexes[i].i

      slices.push(txt.slice(prev, ind))
      slices.push(Accs[indexes[i].acc])

      prev = ind + 1
    }

    slices.push(txt.slice(prev))
    return slices
  }

  render() {
    const txt    = this.props.txt
    const slices = this.slice(txt)

    return (
      <div>
        {slices}
      </div>
    )
  }
}

export default Label
