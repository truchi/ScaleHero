import React, { Component } from 'react'
import MuJS from 'mujs'
import Box from './Box'

const   FLAT = MuJS.symbols.ACCS.flat
const DBFLAT = FLAT + FLAT
const  SHARP = MuJS.symbols.ACCS.sharp
const INTVS  = [
  [ `${FLAT}2`              ]
, [        `2`, `${DBFLAT}3`]
, [`${SHARP}2`,   `${FLAT}3`]
, [        `3`,   `${FLAT}4`]
, [`${SHARP}3`,          `4`]
, [`${SHARP}4`,   `${FLAT}5`]
, [        `5`, `${DBFLAT}6`]
, [`${SHARP}5`,   `${FLAT}6`]
, [        `6`, `${DBFLAT}7`]
, [`${SHARP}6`,   `${FLAT}7`]
, [        `7`              ]
].map(column =>
  column.map(intv => new MuJS.Interval(intv))
)

class IntervalList extends Component {
  onClick(intv) {
    this.props.onClick && this.props.onClick(intv)
  }

  render() {
    return (
      <div className="IntervalList">
        {this.props.intvs.map((column, i) =>
          <div className="Column" key={i}>
            {column.map((intv, j) =>
              <Box
                key={j}
                item={intv}
                onClick={this.onClick.bind(this, intv)}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}

export { INTVS }
export default IntervalList
