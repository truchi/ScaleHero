import React, { Component } from 'react'
import MuJS from 'mujs'
import BoardView from './BoardView'
import ModesView from './ModesView'

class App extends Component {
  constructor(props) {
    super(props)

    let data = {}
    this.props.dict.forEach(scale => {
      const length = scale.intvs.length

      data[length] = !data[length]
        ?
          {
            title: `${length} notes`
          , lists: []
          }
        : data[length]

      data[length].lists.push(scale)
    })

    this.state = {
      guitar: this.props.guitar
    , mode  : this.props.mode
    , data  : data
    }
  }

  getModeDetails(mode) {
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
    const data     = this.state.data
    const mode     = this.state.mode
    const details  = this.getModeDetails(mode)
    const guitar   = this.state.guitar
    const onChange = this.onModeChange.bind(this)

    return (
      <div>
        <ModesView
          current={Object.keys(data)[0]}
          groups={data}
          onChange={onChange}
        />
        <BoardView
          guitar={guitar}
          mode={mode}
          onChange={onChange}
        />
        <ModesView
          current={Object.keys(details)[0]}
          groups={details}
          onChange={onChange}
        />
      </div>
    )
  }
}

export default App
