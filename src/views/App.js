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

    this.modesViewsData = {}
    window.DICT.forEach(scale => {
      const length = scale.intvs.length

      this.modesViewsData[length] = !this.modesViewsData[length]
        ?
          {
            title: `${length} notes`
          , lists: []
          }
        : this.modesViewsData[length]

      this.modesViewsData[length].lists.push(scale)
    })

    this.modeViewsData = this.getModeViewData(this.state.mode)
  }

  getModeViewData(mode) {
    const data     = {}
    const scale    = mode.scale()
    const modes    = scale.modes
    const includes = mode.includes
    const included = mode.included
    const similars = mode.similars

    if (modes.length > 1) {
      data.modes = {
        title: 'Modes'
      , lists: [{ name: scale.name, modes: modes }]
      }
    }

    if (includes.length) {
      data.includes = {
        title: 'Includes'
      , lists: [{ name: '', modes: includes }]
      }
    }

    if (included.length) {
      data.included = {
        title: 'Included'
      , lists: [{ name: '', modes: included }]
      }
    }

    if (similars.length) {
      data.similars = {
        title: 'Similars'
      , lists: [{ name: '', modes: similars }]
      }
    }

    return data
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
          data={this.modeViewsData}
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
