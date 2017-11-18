import React, { Component } from 'react'
import css from 'react-css-vars'
import Interval from '../models/Interval'
import Note from './../models/Note'
import Mode from './../models/Mode'

const   FLAT = Interval.FLAT
const DBFLAT = FLAT + FLAT
const  SHARP = Interval.SHARP

const SelectorEl = css({
  tag        : 'div'
, className  : 'Selector'
, displayName: 'Selector'
}, {
  $: (props, $) => {}
})

const NoteEl = css({
  tag        : 'div'
, className  : 'Note'
, displayName: 'Note'
}, {
  $: (props, $) => {
    const short = props.note.name.short
    const accs  = props.note.name.accidentals

    $.attrs.set('base', short)
    $.attrs.set('accs', accs )

    if (props.note._selected) {
      $.classes.add('selected')
    } else {
      $.classes.remove('selected')
    }
  }
})

const ColumnEl = css({
  tag        : 'div'
, className  : 'Column'
, displayName: 'Column'
}, {
  $: (props, $) => {}
})

const IntervalEl = css({
  tag        : 'div'
, className  : 'Interval'
, displayName: 'Interval'
}, {
  $: (props, $) => {
    if (props.i === 6 && props.j === 0) {
      $.classes.add('shift')
    } else {
      $.classes.remove('shift')
    }

    if (!props.interval) return

    const short = props.interval.name.short
    const accs  = props.interval.name.accidentals

    $.attrs.set('base', short)
    $.attrs.set('accs', accs )

    if (props.interval._selected) {
      $.classes.add('selected')
    } else {
      $.classes.remove('selected')
    }
  }
})

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
              note={note}
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
                  interval={interval}
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
