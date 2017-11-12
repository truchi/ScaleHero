import React, { Component } from 'react'
import styled from 'styled-components'
import Fret from './Fret'
import Note from './../models/Note'

const Tag = styled.div.attrs({
})`
  display: flex;
`

class String extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const open  = this.props.open
    const notes = [open].concat(
      Array(this.props.guitar.frets).fill(0)
        .map((e, i) => open.add(Note.fromHalfs(i + 1)))
    )

    return (
      <Tag>
        {notes.map((note, i) =>
          <Fret key={i} note={note}
                scale={this.props.scale} />
        )}
      </Tag>
    )
  }
}

export default String
