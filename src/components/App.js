import React, { Component } from 'react'
import MuJS from 'mujs'
import Guitar from './Guitar'
// import Selector from './Selector'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      guitar: {
        frets : 15
      , tuning: MuJS.utils.str2items(MuJS.Note, 'E A D B G E').reverse()
      }
    , mode: window.DICT[15].modes[0]
    }
  }

  onScaleChange(mode) {
    this.setState({ mode })
  }

  render() {
    return (
      <div>
        <Guitar guitar={this.state.guitar} mode={this.state.mode} />
        {/* <Selector mode={this.state.mode} onChange={this.onScaleChange.bind(this)} /> */}
      </div>
    )
  }
}

export default App
