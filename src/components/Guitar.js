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
    let Inlays = Array(this.props.guitar.frets + 1).fill(0).map((x, i) => {
      let Inlay = <div className='inlay' key={i}></div>
      let num   = i % 12

      Inlay = [3, 5, 7, 9].includes(num)
        ? <div className='inlay single' key={i}></div>
        : Inlay
      Inlay = i !== 0 && num === 0
        ? <div className='inlay double' key={i}></div>
        : Inlay

      return Inlay
    })

    return (
      <GuitarEl>
        <div className='wrap' key='-1'>
          <StringEl>
            {Inlays}
          </StringEl>
        </div>
        {this.props.guitar.tuning.map((note, i) => {
          const notes = [note].concat(
            Array(this.props.guitar.frets).fill(0)
              .map((e, i) =>
                note.add(new MuJS.Interval(MuJS.utils.semi2intv(i + 1)))
              )
          )

          return (
            <div className='wrap' key={i}>
              <StringEl>
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
            </div>
          )
        })}
        <div className='wrap' key={this.props.guitar.tuning.length}>
          <StringEl>
            {Inlays}
          </StringEl>
        </div>
      </GuitarEl>
    )
  }
}

export default Guitar
