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
      guitar : this.props.guitar
    , data   : data
    , mode   : null
    , details: null
    , show   : 'modes'
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

    this.setState({ mode, show: 'board' })
  }

  onShowDetails(mode) {
    const details = this.getModeDetails(mode)

    this.setState({ details, show: 'details' })
  }

  show(show) {
    this.setState({ show })
  }

  render() {
    let Button
    let View

    const show          = this.state.show
    const guitar        = this.state.guitar
    const data          = this.state.data
    const mode          = this.state.mode
    const details       = this.state.details
    const onChange      = this.onModeChange.bind(this)
    const onShowDetails = this.onShowDetails.bind(this)
    const buttonClick   = this.show.bind(this)

    switch (show) {
      case 'modes':
        Button = <div />
        View   = <ModesView
          current={Object.keys(data)[0]}
          groups={data}
          onChange={onChange}
        />
        break;
      case 'board':
        Button = <div
          className='button'
          onClick={buttonClick.bind(this, 'modes')}
        />
        View = <BoardView
          guitar={guitar}
          mode={mode}
          onChange={onChange}
          onShowDetails={onShowDetails}
        />
        break;
      case 'details':
      default:
        Button = <div
          className='button'
          onClick={buttonClick.bind(this, 'board')}
        />
        View = <ModesView
          current={Object.keys(details)[0]}
          groups={details}
          onChange={onChange}
        />
        break;
      }

      return (
        <div className="App">
          {Button}
          {View}
        </div>
      )
  }
}

export default App
