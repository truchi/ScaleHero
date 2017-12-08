import React, { Component } from 'react'
import MuJS from 'mujs'
import Keyboard from '../components/Keyboard'
import IntervalPlayer from '../classes/IntervalPlayer'

const ROOTS = MuJS.utils.SEMI2NOTE.map(note => new MuJS.Note(note))

class EarTrainingView extends Component {
  constructor(props) {
    super(props)

    this.state  = {
      root : this.props.mode.root
    , speed: 'half'
    , type : 'harm'
    }

    this.asked       = null
    this.player      = new IntervalPlayer(this.state)
    this.answered    = this.answered.bind(this)
    this.onClickRoot = this.onClickRoot.bind(this)
  }

  render() {
    const root = {
      className: 'root' + (!this.state.root ? ' selected' : '')
    , onClick  : this.onClickRoot
    }
    const harm = {
      className: 'harm' + (this.state.type === 'harm' ? ' selected' : '')
    , onClick  : this.onClickType.bind(this, 'harm')
    }
    const melo = {
      className: 'melo' + (this.state.type === 'melo' ? ' selected' : '')
    , onClick  : this.onClickType.bind(this, 'melo')
    }
    const speed = {
      className: 'speed' + (this.state.type === 'harm' ? ' hide' : '')
    }
    const half = {
      className: 'half' + (this.state.speed === 'half' ? ' selected' : '')
    , onClick  : this.onClickSpeed.bind(this, 'half')
    }
    const whole = {
      className: 'whole' + (this.state.speed === 'whole' ? ' selected' : '')
    , onClick  : this.onClickSpeed.bind(this, 'whole')
    }

    if (!this.asked) this.ask()

    return (
      <div className='EarTrainingView'>
        <Keyboard
          mode={this.props.mode}
          onClick={this.answered}
        />
        <div className='controls'>
          <div
            className={root.className}
            onClick={root.onClick}
          />
          <div className='type'>
            <div
              className={harm.className}
              onClick={harm.onClick}
            />
            <div
              className={melo.className}
              onClick={melo.onClick}
            />
          </div>
          <div className={speed.className} acc=''>
            <div
              className={half.className}
              onClick={half.onClick}
            >
              E
            </div>
            <div
              className={whole.className}
              onClick={whole.onClick}
            >
              Q
            </div>
          </div>
        </div>
      </div>
    )
  }

  ask() {
    const root  = this.state.root || this._random(ROOTS)
    this.asked  = this._random(
      this.props.mode.intvs.filter(intv => intv !== this.asked)
    )

    this.player
      .opts(this.state)
      .play(root, this.asked)
  }

  answered(intv) {
    if (!intv) return

    if (this.asked.semi === intv.semi) this.ask()
  }

  onClickRoot() {
    this.setState({
      root: this.state.root
        ? null
        : this.props.mode.root
    })
  }

  onClickType(type) {
    if (type !== this.state.type) this.setState({ type })
  }

  onClickSpeed(speed) {
    if (speed !== this.state.speed) this.setState({ speed })
  }

  _random(arr) {
    return arr[Math.floor(Math.random() * arr.length - 1) + 1]
  }
}

export default EarTrainingView
