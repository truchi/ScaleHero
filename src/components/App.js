import React, { Component } from 'react'
import MuJS from 'mujs'
import Guitar from './Guitar'
import Selector from './Selector'
import ModeList from './ModeList'

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
    const modes = [].concat(window.DICT[5].modes[0], window.DICT[16].modes[0], window.DICT[21].modes[0])

    return (
      <div>
        <ModeList name="Includes" modes={modes} showScalesName={false} />
        <Guitar guitar={this.state.guitar} mode={this.state.mode} />
        <Selector mode={this.state.mode} onChange={this.onModeChange.bind(this)} />
      </div>
    )
  }
}

export default App
