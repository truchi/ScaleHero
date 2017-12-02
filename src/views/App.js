import React, { Component } from 'react'
import MuJS from 'mujs'
import BoardView from './BoardView'
import ModesView from './ModesView'

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
    const root = mode.root
    mode       = MuJS.Dict.get(mode)
    mode.root  = root
    mode.name  = mode.name || '?'

    this.setState({ mode })
  }

  render() {
    const mode     = this.state.mode
    const guitar   = this.state.guitar
    const onChange = this.onModeChange.bind(this)

    return (
      <div>
        <ModesView
          dict={window.DICT}
        />
        {/* <BoardView
          guitar={guitar}
          mode={mode}
          onChange={onChange}
        /> */}
      </div>
    )
  }
}

export default App
