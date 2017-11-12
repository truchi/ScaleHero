import React, { Component } from 'react'
import styled from 'styled-components'
import Note from './../models/Note'

const GuitarEl = styled.div.attrs({
})`
  display: inline-block;
  background-color: ${props => props.theme.background};
`
const StringEl = styled.div.attrs({
})`
  display: flex;
`
const FretEl = styled.div.attrs({
  color: props => props.theme.colors[props.short][props.accidentals]
})`
  display: inline-block;
  margin: ${props => props.theme.guitar.margin};
  border-color: ${props => ['1', '3', '5', '7'].includes(props.short)
    ? props.theme.guitar.highlight
    : props.theme.background};
  border-width: ${props => props.theme.guitar.borderWidth};
  border-style: ${props => props.theme.guitar.borderStyle};
  border-radius: ${props => props.theme.guitar.radius};
  background-color: ${props => props.color};
  width : ${props => props.theme.guitar.width};
  height: ${props => props.theme.guitar.height};
`

class Guitar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <GuitarEl>
        {this.props.guitar.tuning.reverse().map((note, i) => {
          const notes = [note].concat(
            Array(this.props.guitar.frets).fill(0)
              .map((e, i) => note.add(Note.fromHalfs(i + 1)))
          )

          return <StringEl key={i}>
            {notes.map((note, i) => {
              let interval= this.props.scale.mode.getDegree(
                Note.fromHalfs(note.halfs - this.props.scale.root.halfs)
              )
              let short       = '0'
              let accidentals = '0'

              if (interval) {
                short       = interval.name.short
                accidentals = interval.name.accidentals
              }

              return <FretEl key={i} short={short} accidentals={accidentals} />
            })}
          </StringEl>
        })}
      </GuitarEl>
    )
  }
}

export default Guitar
