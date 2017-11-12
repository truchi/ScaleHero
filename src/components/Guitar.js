import React, { Component } from 'react'
import String from './String'

class Guitar extends Component {
  constructor(props) {
    super(props)

    const ionian = window.SCALES[15].modes[0]
    this.state = {
      mode: ionian
    }
  }

  render() {
    return (
      <div>
        {this.props.tuning.map((note, i) =>
          <String key={i} open={note} frets={this.props.frets} mode={this.state.mode} />
        )}
      </div>
    )
  }
}

export default Guitar
