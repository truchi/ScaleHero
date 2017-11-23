import React, { Component } from 'react'
import MuJS from 'mujs'
import Guitar from './Guitar'
import Selector from './Selector'
import Mode from './Mode'
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
    mode = MuJS.Dict.get(mode)

    this.setState({ mode })
  }

  render() {
    let mode      = this.state.mode
    mode.included = mode.included.filter(mode => mode.name !== 'Chromatic')

    return (
      <div>
        <Mode
          mode={mode}
        />
        <ModeList
          name="Includes"
          modes={mode.includes}
          showScalesName={false}
        />
        <ModeList
          name="Included"
          modes={mode.included}
          showScalesName={false}
        />
        <Guitar
          guitar={this.state.guitar}
          mode={mode}
        />
        <Selector
          mode={mode}
          onChange={this.onModeChange.bind(this)}
        />
      </div>
    )
  }
}

export default App
