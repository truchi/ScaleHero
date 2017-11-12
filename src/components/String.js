import React, { Component } from 'react'
import Fret from './Fret'
import Note from './../models/Note'

class String extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const open  = this.props.open
    const notes = [open].concat(
      Array(this.props.frets).fill(0).map((e, i) => open.add(Note.fromHalfs(i + 1)))
    )

    return (
      <div>
        {notes.map((note, i) =>
          <Fret key={i} note={note} mode={this.props.mode}/>
        )}
      </div>
    )
  }
}

export default String
