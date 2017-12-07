import React, { Component } from 'react'
import MuJS from 'mujs'
import BoardView from './BoardView'
import ModesView from './ModesView'
import EarTrainingView from './EarTrainingView'

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

    if (!scale.name) {
      scale.name = mode.toString()
      modes.splice(0, 1, mode)
    }

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
    switch (this.state.show) {
      case 'modes'  : return this.renderModes()
      case 'board'  : return this.renderBoard()
      case 'details': return this.renderDetails()
      case 'ear'    : return this.renderEar()
    }
  }

  renderModes() {
    const data     = this.state.data
    const onChange = this.onModeChange.bind(this)

    return (
      <div className="App">
        <ModesView
          current={Object.keys(data)[0]}
          groups={data}
          onChange={onChange}
        />
      </div>
    )
  }

  renderBoard() {
    const guitar        = this.state.guitar
    const mode          = this.state.mode
    const onChange      = this.onModeChange.bind(this)
    const onShowDetails = this.onShowDetails.bind(this)
    const show          = this.show

    return (
      <div className="App">
        <div
          className='button arrow left'
          onClick={show.bind(this, 'modes')}
        />
        {mode.intvs.length > 1 &&
          <div
            className='button arrow right'
            onClick={show.bind(this, 'ear')}
          />
        }
        <BoardView
          guitar={guitar}
          mode={mode}
          onChange={onChange}
          onShowDetails={onShowDetails}
        />
      </div>
    )
  }

  renderDetails() {
    const details     = this.state.details
    const onChange    = this.onModeChange.bind(this)
    const show        = this.show.bind(this, 'board')

    return (
      <div className="App">
        <div
          className='button arrow left'
          onClick={show}
        />
        <ModesView
          current={Object.keys(details)[0]}
          groups={details}
          onChange={onChange}
        />
      </div>
    )
  }

  renderEar() {
    const mode = this.state.mode
    const show = this.show.bind(this, 'board')

    return (
      <div className="App">
        <div
          className='button arrow left'
          onClick={show}
        />
        <EarTrainingView
          mode={mode}
        />
      </div>
    )
  }
}

export default App
