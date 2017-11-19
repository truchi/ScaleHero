import React, { Component } from 'react'
import MuJS from 'mujs'
import css from 'react-css-vars'

const   FLAT = MuJS.symbols.ACCS.flat
const DBFLAT = FLAT + FLAT
const  SHARP = MuJS.symbols.ACCS.sharp

const SelectorEl = css({
  tag        : 'div'
, className  : 'Selector'
, displayName: 'Selector'
})

const NoteEl = css({
  tag        : 'div'
, className  : 'Note'
, displayName: 'Note'
}, (props, $) => {
  const base = props.note.base
  const accs = props.note.accs

  $.attrs.set('base', base)
  $.attrs.set('accs', accs)

  if (props.note._selected) {
    $.classes.add('selected')
  } else {
    $.classes.remove('selected')
  }
})

const ColumnEl = css({
  tag        : 'div'
, className  : 'Column'
, displayName: 'Column'
})

const IntervalEl = css({
  tag        : 'div'
, className  : 'Interval'
, displayName: 'Interval'
}, (props, $) => {
  if (props.i === 6 && props.j === 0) {
    $.classes.add('shift')
  } else {
    $.classes.remove('shift')
  }

  if (!props.intv) return

  const base = props.intv.base
  const accs = props.intv.accs

  $.attrs.set('base', base)
  $.attrs.set('accs', accs)

  if (props.intv._selected) {
    $.classes.add('selected')
  } else {
    $.classes.remove('selected')
  }
})

class Selector extends Component {
  constructor(props) {
    super(props)

    let selected = this.props.mode.intvs
      .map(intv => intv.name)

    let notes =
      [ `C`, `D${FLAT}`, `D`, `E${FLAT}`, `E`, `F`, `G${FLAT}`
      , `G`, `A${FLAT}`, `A`, `B${FLAT}`, `B` ].map(note => {
        note = new MuJS.Note(note)
        note._selected = this.props.mode.root.semi === note.semi

        return note
      })

    let intvs = [
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
  ].map(column => column.map(intv => {
      if (intv === null) return null

      intv           = new MuJS.Interval(intv)
      intv._selected = false
      if (selected.includes(intv.name))
        intv._selected = true

      return intv
    }))

    this.state = {
      notes
    , intvs
    }
  }

  onClickNote(i) {
    let notes = this.state.notes

    notes.forEach(note => note._selected = false)
    notes[i]._selected = true

    this.changeMode({ notes, intvs: this.state.intvs })
  }

  onClickInterval(intv, i, j) {
    if (!intv) return

    let intvs = this.state.intvs
    let prev  = intvs[i][j]._selected

    intvs[i].forEach(intv => intv && (intv._selected = false))
    intvs[i][j]._selected = !prev

    this.changeMode({ notes: this.state.notes, intvs })
  }

  changeMode({ notes, intvs }) {
    this.props.onChange(
      new MuJS.Mode(
        new MuJS.Note(notes.filter(note => note._selected)[0].name)
      , Array.prototype.concat.apply(
          [new MuJS.Interval(MuJS.symbols.INTVS[0])]
        , intvs
            .map(column => column.filter(intv => intv && intv._selected))
            .filter(arr => arr.length)
        )
      )
    )
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
            >{note.name}</NoteEl>
          )}
        </div>
        <div>
          {this.state.intvs.map((column, i) =>
          <ColumnEl key={i}>
              {column.map((intv, j) =>
                <IntervalEl
                  key={j}
                  i={i}
                  j={j}
                  intv={intv}
                  onClick={this.onClickInterval.bind(this, intv, i, j)}
                >{intv ? intv.name : ''}</IntervalEl>
              )}
            </ColumnEl>
          )}
        </div>
      </SelectorEl>
    )
  }
}

export default Selector
