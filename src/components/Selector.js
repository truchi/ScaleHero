import React, { Component } from 'react'
import styled from 'styled-components'
import Interval from '../models/Interval'
import Note from './../models/Note'
import Mode from './../models/Mode'

const   FLAT = Interval.FLAT
const DBFLAT = FLAT + FLAT
const  SHARP = Interval.SHARP

const SelectorEl = styled.div.attrs({})`
  display: inline-block;
  background: ${props => props.theme.background};
  user-select: none;
`
const NoteEl = styled.div.attrs({
  color: props => props.theme.colors[props.short][props.accidentals]
})`
  display: inline-block;
  width: ${props => props.theme.selector.width};
  height: ${props => props.theme.selector.height};
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
  cursor: pointer;
  text-align: center;
`
const ColumnEl = styled.div.attrs({})`
  display: inline-block;
  vertical-align: top;
`
const IntervalEl = NoteEl.extend.attrs({
  height: props => props.i === 6 && props.j === 0
    ? parseInt(props.theme.selector.height) / 4 + 'px'
    : props.theme.selector.height
, color: props => props.short
    ? props.theme.colors[props.short][props.accidentals]
    : props.theme.background
})`
  display: block;
  height: ${props => props.height};
  cursor: ${props => props.short ? 'pointer' : 'initial'};
  text-align: right;
`

class Selector extends Component {
  constructor(props) {
    super(props)

    let selected = this.props.scale.mode.intervals
      .map(interval => interval.name.full)

    let notes =
      [ `C`, `D${FLAT}`, `D`, `E${FLAT}`, `E`, `F`, `G${FLAT}`
      , `G`, `A${FLAT}`, `A`, `B${FLAT}`, `B` ].map(note => {
        note = new Note(note)
        note._selected = this.props.scale.root.halfs === note.halfs

        return note
      })

    let intervals = [
      [       null,        null,         null]
    , [       null,  `${FLAT}2`,         null]
    , [       null,         `2`, `${DBFLAT}3`]
    , [`${SHARP}2`,  `${FLAT}3`,         null]
    , [       null,         `3`,   `${FLAT}4`]
    , [`${SHARP}3`,         `4`,         null]
    , [       null, `${SHARP}4`,   `${FLAT}5`]
    , [       null,         `5`, `${DBFLAT}6`]
    , [`${SHARP}5`,  `${FLAT}6`,         null]
    , [       null,         `6`, `${DBFLAT}7`]
    , [`${SHARP}6`,  `${FLAT}7`,         null]
    , [       null,         `7`,         null]
  ].map(column => column.map(interval => {
      if (interval === null) return null

      interval           = new Interval(interval)
      interval._selected = false
      if (selected.includes(interval.name.full))
        interval._selected = true

      return interval
    }))

    this.state = {
      notes
    , intervals
    }
  }

  onClickNote(i) {
    let notes = this.state.notes

    notes.forEach(note => note._selected = false)
    notes[i]._selected = true

    this.changeScale({ notes, intervals: this.state.intervals })
  }

  onClickInterval(interval, i, j) {
    if (!interval) return

    let intervals = this.state.intervals
    let prev      = intervals[i][j]._selected

    intervals[i].forEach(interval => interval && (interval._selected = false))
    intervals[i][j]._selected = !prev

    this.changeScale({ notes: this.state.notes, intervals })
  }

  changeScale({ notes, intervals }) {
    this.props.onChange({
      root: new Note(notes.filter(note => note._selected)[0].name.full)
    , mode: new Mode(
        Array.prototype.concat.apply([new Interval(1)],
          intervals
            .map(column => column
                .filter(interval => interval && interval._selected))
            .filter(arr => arr.length)
        )
      )
    })
  }

  render() {
    return (
      <SelectorEl>
        <div>
          {this.state.notes.map((note, i) =>
            <NoteEl
              key={i}
              selected={note._selected}
              short={note.name.short}
              accidentals={note.name.accidentals}
              onClick={this.onClickNote.bind(this, i)}
            >{note.name.full}</NoteEl>
          )}
        </div>
        <div>
          {this.state.intervals.map((column, i) =>
          <ColumnEl key={i}>
              {column.map((interval, j) =>
                <IntervalEl
                  key={j}
                  i={i}
                  j={j}
                  short={interval ? interval.name.short : null}
                  accidentals={interval ? interval.name.accidentals : null}
                  selected={interval ? interval._selected : false}
                  onClick={this.onClickInterval.bind(this, interval, i, j)}
                >{interval ? interval.name.full : ''}</IntervalEl>
              )}
            </ColumnEl>
          )}
        </div>
      </SelectorEl>
    )
  }
}

export default Selector
