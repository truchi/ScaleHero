import React, { Component } from 'react'
import MuJS from 'mujs'
import Box from './Box'

const  FLAT = MuJS.symbols.ACCS.flat
const NOTES =
  [ `C`, `D${FLAT}`, `D`, `E${FLAT}`, `E`, `F`, `G${FLAT}`
  , `G`, `A${FLAT}`, `A`, `B${FLAT}`, `B` ]
    .map(note => new MuJS.Note(note))

class NoteList extends Component {
  onClick(note) {
    this.props.onClick && this.props.onClick(note)
  }

  render() {
    return (
      <div className="NoteList">
        {this.props.notes.map((note, i) =>
          <Box
            key={i}
            item={note}
            onClick={this.onClick.bind(this, note)}
          />
        )}
      </div>
    )
  }
}

export { NOTES }
export default NoteList
