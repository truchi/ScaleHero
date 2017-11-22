import React, { Component } from 'react'
import MuJS from 'mujs'
import Guitar from './Guitar'
import Selector from './Selector'

import Mode from './Mode'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      guitar: {
        frets : 15
      , tuning: MuJS.utils.str2items(MuJS.Note, 'E A D G B E').reverse()
      }
    , mode: window.DICT[15].modes[0]
    }
  }

  onModeChange(mode) {
    this.setState({ mode })
  }

  render() {
    return (
      <div>
        <Mode showScaleName={false} mode={window.DICT[5].modes[0]} />
        <Mode showScaleName={false} mode={window.DICT[16].modes[0]} />
        <Mode showScaleName={false} mode={window.DICT[21].modes[0]} />
        <Guitar guitar={this.state.guitar} mode={this.state.mode} />
        <Selector mode={this.state.mode} onChange={this.onModeChange.bind(this)} />
      </div>
    )
  }
}

export default App
