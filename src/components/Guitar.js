import React, { Component } from 'react'
import MuJS from 'mujs'
import css from 'react-css-vars'
import Box from './Box'

const GuitarEl = css({
  tag        : 'div'
, className  : 'Guitar'
, displayName: 'Guitar'
})

const StringEl = css({
  tag        : 'div'
, className  : 'String'
, displayName: 'String'
})

let NOFRET  = new MuJS.Interval()
NOFRET.name = ''
NOFRET.base = '0'
NOFRET.accs = 0

class Guitar extends Component {
  render() {
    return (
      <GuitarEl>
        {this.props.guitar.tuning.map((note, i) => {
          const notes = [note].concat(
            Array(this.props.guitar.frets).fill(0)
              .map((e, i) =>
                note.add(new MuJS.Interval(MuJS.utils.semi2intv(i + 1)))
              )
          )

          return <StringEl key={i}>
            {notes.map((note, i) => {
              let diff = note.semi - this.props.mode.root.semi

              let interval = this.props.mode.getDegree(
                new MuJS.Note(MuJS.utils.semi2note(diff))
              ) || NOFRET

              if (['1', '3', '5', '7'].includes(interval.base)) {
                interval._selected = true
              }

              return <Box key={i} item={interval} />
            })}
          </StringEl>
        })}
      </GuitarEl>
    )
  }
}

export default Guitar
