import React, { Component } from 'react'
import css from 'react-css-vars'
import Note from './../models/Note'

const GuitarEl = css({
  tag        : 'div'
, className  : 'Guitar'
, displayName: 'Guitar'
}, {
  $: (props, $) => {}
})

const StringEl = css({
  tag        : 'div'
, className  : 'String'
, displayName: 'String'
}, {
  $: (props, $) => {}
})

const FretEl = css({
  tag        : 'div'
, className  : 'Fret'
, displayName: 'Fret'
}, {
  $: (props, $) => {
    let short = '0'
    let accs  = '0'

    if (props.interval) {
      short = props.interval.name.short
      accs  = props.interval.name.accidentals
    }

    $.attrs.set('base', short)
    $.attrs.set('accs', accs )

    if (['1', '3', '5', '7'].includes(short)) {
      $.classes.add('highlight')
    } else {
      $.classes.remove('highlight')
    }

  }
})

class Guitar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <GuitarEl>
        {this.props.guitar.tuning.map((note, i) => {
          const notes = [note].concat(
            Array(this.props.guitar.frets).fill(0)
              .map((e, i) => note.add(Note.fromHalfs(i + 1)))
          )

          return <StringEl key={i}>
            {notes.map((note, i) => {
              let interval= this.props.scale.mode.getDegree(
                Note.fromHalfs(note.halfs - this.props.scale.root.halfs)
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
