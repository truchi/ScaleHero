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
    , speed: 'slow'
    , type : 'both'
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
      className: 'harm' + (this.state.type  === 'melo' ? '' : ' selected')
    , onClick  : this.onClickType.bind(this, 'harm')
    }
    const melo = {
      className: 'melo' + (this.state.type  === 'harm' ? '' : ' selected')
    , onClick  : this.onClickType.bind(this, 'melo')
    }
    const slow = {
      className: 'slow' + (this.state.speed  === 'slow' ? ' selected' : '')
    , onClick  : this.onClickSpeed.bind(this, 'slow')
    }
    const fast = {
      className: 'fast' + (this.state.speed  === 'fast' ? ' selected' : '')
    , onClick  : this.onClickSpeed.bind(this, 'fast')
    }

    this.ask()

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
          <div className='speed' acc=''>
            <div
              className={slow.className}
              onClick={slow.onClick}
            >
              Q
            </div>
            <div
              className={fast.className}
              onClick={fast.onClick}
            >
              E
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

    this.player.play(root, this.asked)
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
    if (this.state.type === 'both') {
      if (type === 'harm') return this.setState({ type: 'melo' })
      else                 return this.setState({ type: 'harm' })
    } else {
      if (type !== this.state.type)
        return this.setState({ type: 'both' })
    }
  }

  onClickSpeed(speed) {
    if (speed !== this.state.speed) this.setState({ speed })
  }

  _random(arr) {
    return arr[Math.floor(Math.random() * arr.length - 1) + 1]
  }
}

export default EarTrainingView
