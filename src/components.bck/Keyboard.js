import React, { Component } from 'react'
import MuJS from 'mujs'
import Box from './Box'

let NOBOX  = new MuJS.Interval()
NOBOX.name = ''
NOBOX.base = '0'
NOBOX.accs = 0

class Keyboard extends Component {
  render() {
    const mode = this.props.mode
    let   rows = [[1, 3, 6, 8, 10], [2, 4, 5, 7, 9, 11, 0]]
    rows[1].unshift(-1)

    mode.intvs.forEach(intv => {
      let i = rows[0].indexOf(intv.semi)
      if (i !== -1) {
        return rows[0][i] = intv
      }

      if (intv.semi === 0) {
        intv = intv.clone()
        intv.name = '8'
      }

      i = rows[1].indexOf(intv.semi)
      if (i !== -1) rows[1][i] = intv
    })

    const mapNotes = intv => {
      const nobox   = Number.isInteger(intv)
      const item    = nobox ? NOBOX : intv
      const onClick = nobox
        ? null
        : ((onClick, item) => () => onClick(item))(this.props.onClick, intv)

      return <Box
        key={nobox ? intv : intv.semi}
        item={item}
        onClick={onClick}
      />
    }

    rows = rows.map(row => row.map(mapNotes))

    return (
      <div className='Keyboard'>
        <div className='row top'>
          {rows[0]}
        </div>
        <div className='row bottom'>
          {rows[1]}
        </div>
      </div>
    )
  }
}

export default Keyboard
