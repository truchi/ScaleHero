import React, { Component } from 'react'
import MuJS from 'mujs'
import NoteList, { NOTES } from './NoteList'
import IntervalList, { INTVS } from './IntervalList'

class Selector extends Component {
  constructor(props) {
    super(props)

    let notes = NOTES
      .map(note => {
        note._selected = this.props.mode.root.semi === note.semi

        return note
      })

    let intvs = INTVS

    this.state = {
      notes
    , intvs
    }
  }

  onClickNote(note) {
    this.changeMode({
      intvs: this.state.intvs
    , notes: this.state.notes.map(_note => {
        if (note === _note) {
          _note._selected = true
        } else {
          _note._selected = false
        }

        return _note
      })
    })
  }

  onClickInterval(intv) {
    this.changeMode({
      notes: this.state.notes
    , intvs: this.state.intvs.map(column => {
        if (column.indexOf(intv) !== -1) {
          return column.map(_intv => {
            if (intv === _intv) {
              _intv._selected = !_intv._selected
            } else {
              _intv._selected = false
            }

            return _intv
          })
        }

        return column
      })
    })
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
    const notes    = this.state.notes
    const selected = this.props.mode.intvs
      .map(intv => intv.name)
    const intvs = this.state.intvs
      .map(column => column.map(intv => {
        intv._selected = false
        if (selected.includes(intv.name)) {
          intv._selected = true
        }

        return intv
      })
    )

    return (
      <div className="Selector">
        <NoteList
          notes={notes}
          onClick={this.onClickNote.bind(this)}
        />
        <br />
        <IntervalList
          intvs={intvs}
          onClick={this.onClickInterval.bind(this)}
        />
      </div>
    )
  }
}

export default Selector
