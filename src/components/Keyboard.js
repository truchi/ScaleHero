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

    mode.intvs.forEach(intv => {
      let i = rows[0].indexOf(intv.semi)
      if (i !== -1) rows[0][i] = intv

      i = rows[1].indexOf(intv.semi)
      if (i !== -1) rows[1][i] = intv
    })

    const mapNotes = intv => {
      const nobox = Number.isInteger(intv)

      return <Box
        key={nobox ? intv : intv.semi}
        item={nobox ? NOBOX : intv}
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
