import React, { Component } from 'react'
import MuJS from 'mujs'
import css from 'react-css-vars'
import Box from './Box'

const   FLAT = MuJS.symbols.ACCS.flat
const DBFLAT = FLAT + FLAT
const  SHARP = MuJS.symbols.ACCS.sharp

const SelectorEl = css({
  tag        : 'div'
, className  : 'Selector'
, displayName: 'Selector'
})

const ColumnEl = css({
  tag        : 'div'
, className  : 'Column'
, displayName: 'Column'
})

class Selector extends Component {
  constructor(props) {
    super(props)

    let notes =
      [ `C`, `D${FLAT}`, `D`, `E${FLAT}`, `E`, `F`, `G${FLAT}`
      , `G`, `A${FLAT}`, `A`, `B${FLAT}`, `B` ].map(note => {
        note = new MuJS.Note(note)
        note._selected = this.props.mode.root.semi === note.semi

        return note
      })

    let intvs = [
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
    ].map(column => column.map(intv => new MuJS.Interval(intv)))

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
      <SelectorEl>
        <div className="notes">
          {this.state.notes.map((note, i) =>
            <Box
              key={i}
              item={note}
              onClick={this.onClickNote.bind(this, i)}
            />
          )}
        </div>
        <br />
        <div className="intervals">
          {intvs.map((column, i) =>
            <ColumnEl key={i}>
              {column.map((intv, j) =>
                <Box
                  key={j}
                  item={intv}
                  onClick={this.onClickInterval.bind(this, intv, i, j)}
                />
              )}
            </ColumnEl>
          )}
        </div>
      </SelectorEl>
    )
  }
}

export default Selector
