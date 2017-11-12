import React, { Component } from 'react'
import styled from 'styled-components'
import Interval from '../models/Interval'

const   FLAT = Interval.FLAT
const DBFLAT = FLAT + FLAT
const  SHARP = Interval.SHARP
const SelectorEl = styled.div.attrs({
})`
  display: inline-block;
  background: ${props => props.theme.background};
  color: ${props => props.theme.selector.color};
`
const ColumnEl = styled.div.attrs({
})`
  display: inline-block;
  vertical-align: top;
`
const IntervalEl = styled.div.attrs({
  height: props => props.i === 5 && props.j === 0
    ? parseInt(props.theme.selector.height) / 4 + 'px'
    : props.theme.selector.height
, color: props => props.short
    ? props.theme.colors[props.short][props.accidentals]
    : props.theme.background
})`
  display: block;
  width: ${props => props.theme.selector.width};
  height: ${props => props.height};
  line-height: ${props => props.theme.selector.height};
  background: ${props => props.color};
  margin: ${props => props.theme.selector.margin};
  padding: ${props => props.theme.selector.padding};
  border-radius: ${props => props.theme.selector.radius};
  border-color: ${props => props.selected
    ? props.theme.selector.highlight
    : props.theme.background};
  border-width: ${props => props.theme.selector.borderWidth};
  border-style: ${props => props.theme.selector.borderStyle};
  cursor: ${props => props.short ? 'pointer' : 'initial'};
  text-align: right;
`

class Selector extends Component {
  constructor(props) {
    super(props)

    let selected = this.props.scale.mode.intervals
      .map(interval => interval.name.full)

    let [ flat2, nat2, sharp2, dbflat3, flat3, nat3, sharp3
    , flat4, nat4, sharp4, flat5, nat5, sharp5, dbflat6
    , flat6, nat6, sharp6, dbflat7, flat7, nat7 ] =
      [ `${FLAT}2`, `2`, `${SHARP}2`, `${DBFLAT}3`, `${FLAT}3`
      , `3`, `${SHARP}3`, `${FLAT}4`, `4`, `${SHARP}4`, `${FLAT}5`
      , `5`, `${SHARP}5`, `${DBFLAT}6`, `${FLAT}6`, `6`
      , `${SHARP}6`, `${DBFLAT}7`, `${FLAT}7`, `7` ].map(i => new Interval(i))

    let columns = [
      [  null,  flat2, null   ]
    , [  null,   nat2, dbflat3]
    , [sharp2,  flat3, null   ]
    , [  null,   nat3, flat4  ]
    , [sharp3,   nat4, null   ]
    , [  null, sharp4, flat5  ]
    , [  null,   nat5, dbflat6]
    , [sharp5,  flat6, null   ]
    , [  null,   nat6, dbflat7]
    , [sharp6,  flat7, null   ]
    , [  null,   nat7, null   ]
  ].map(column => column.map(interval => {
      if (interval === null) return null

      interval._selected = false
      if (selected.includes(interval.name.full)) interval._selected = true

      return interval
    }))

    this.state = {
      columns
    }
  }

  onClick(interval, i, j) {
    if (!interval) return

    let columns = this.state.columns
    let prev    = columns[i][j]._selected

    columns[i].forEach(interval => interval && (interval._selected = false))
    columns[i][j]._selected = !prev

    this.setState({ columns })
  }

  render() {
    return (
      <SelectorEl>
        {this.state.columns.map((column, i) =>
          <ColumnEl key={i}>
            {column.map((interval, j) =>
              <IntervalEl
                key={j}
                i={i}
                j={j}
                short={interval ? interval.name.short : null}
                accidentals={interval ? interval.name.accidentals : null}
                selected={interval ? interval._selected : false}
                onClick={this.onClick.bind(this, interval, i, j)}
              >{interval ? interval.name.full : ''}</IntervalEl>
            )}
          </ColumnEl>
        )}
      </SelectorEl>
    )
  }
}

export default Selector
