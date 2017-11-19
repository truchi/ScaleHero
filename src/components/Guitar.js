import React, { Component } from 'react'
import MuJS from 'mujs'
import css from 'react-css-vars'

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

const FretEl = css({
  tag        : 'div'
, className  : 'Fret'
, displayName: 'Fret'
}, (props, $) => {
  let base = '0'
  let accs = '0'

  if (props.interval) {
    base = props.interval.base
    accs = props.interval.accs
  }

  $.attrs.set('base', base)
  $.attrs.set('accs', accs)

  if (['1', '3', '5', '7'].includes(base)) {
    $.classes.add('highlight')
  } else {
    $.classes.remove('highlight')
  }
})

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

              let interval= this.props.mode.getDegree(
                new MuJS.Note(MuJS.utils.semi2note(diff))
              )

              return <FretEl key={i} interval={interval} />
            })}
          </StringEl>
        })}
      </GuitarEl>
    )
  }
}

export default Guitar
