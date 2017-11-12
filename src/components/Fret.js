import React, { Component } from 'react'
import styled from 'styled-components'
import Note from '../models/Note'

const Tag = styled.div.attrs({
  color: props => props.theme.colors[props.short][props.accidentals]
})`
  display: inline-block;
  margin: ${props => props.theme.guitar.margin};
  border-color: ${props => ['1', '3', '5', '7'].includes(props.short) ? props.theme.guitar.highlight : props.theme.background};
  border-width: ${props => props.theme.guitar.borderWidth};
  border-style: ${props => props.theme.guitar.borderStyle};
  border-radius: ${props => props.theme.guitar.radius};
  background-color: ${props => props.color};
  width : ${props => props.theme.guitar.width};
  height: ${props => props.theme.guitar.height};
`

class Fret extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let interval= this.props.scale.mode.getDegree(
      Note.fromHalfs(this.props.note.halfs - this.props.scale.root.halfs)
    )
    let short       = '0'
    let accidentals = '0'

    if (interval) {
      short       = interval.name.short
      accidentals = interval.name.accidentals
    }

    return (
      <Tag short={short} accidentals={accidentals} />
    )
  }
}

export default Fret
