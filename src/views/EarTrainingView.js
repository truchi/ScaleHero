import React, { Component } from 'react'
import MuJS from 'mujs'
import { randomItem } from '../classes/utils'
import Keyboard from '../components/Keyboard'
import IntervalPlayer from '../classes/IntervalPlayer'

const ROOTS = MuJS.utils.SEMI2NOTE.map(note => new MuJS.Note(note))

class EarTrainingView extends Component {
  constructor(props) {
    super(props)

    this.state  = {
      root : this.props.mode.root
    , type : 'harm'
    , speed: 'eighth'
    }

    this.root        = null
    this.asked       = null
    this.player      = new IntervalPlayer(this.state)
    this.answered    = this.answered.bind(this)
    this.onClickRoot = this.onClickRoot.bind(this)
    this.onClickPlay = this.onClickPlay.bind(this)
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
    const eighth = {
      className: 'eighth' + (this.state.speed === 'eighth' ? ' selected' : '')
    , onClick  : this.onClickSpeed.bind(this, 'eighth')
    }
    const quarter = {
      className: 'quarter' + (this.state.speed === 'quarter' ? ' selected' : '')
    , onClick  : this.onClickSpeed.bind(this, 'quarter')
    }
    const half = {
      className: 'half' + (this.state.speed === 'half' ? ' selected' : '')
    , onClick  : this.onClickSpeed.bind(this, 'half')
    }
    const play = {
      className: 'play'
    , onClick  : this.onClickPlay.bind(this)
    }
    const message = ($message) => {
      this.$yep  = $message && $message.querySelector('.yep')
      this.$nope = $message && $message.querySelector('.nope')
    }

    if (!this.asked) this.ask()

    return (
      <div className='EarTrainingView'>
        <div
          className='message'
          ref={message}
        >
          <div className='yep'>Yep!</div>
          <div className='nope'>Nope...</div>
        </div>
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
              className={eighth.className}
              onClick={eighth.onClick}
            >
              E
            </div>
            <div
              className={quarter.className}
              onClick={quarter.onClick}
            >
              Q
            </div>
            <div
              className={half.className}
              onClick={half.onClick}
            >
              W
            </div>
          </div>
          <div
            className={play.className}
            onClick={play.onClick}
          />
        </div>
      </div>
    )
  }

  ask() {
    this.root  = this.state.root || randomItem(ROOTS)
    this.asked = randomItem(
      this.props.mode.intvs.filter(intv => intv !== this.asked)
    )

    this.player
      .opts(this.state)
      .play(this.root, this.asked)
  }

  answered(intv) {
    if (!intv) return

    if (this.asked.semi === intv.semi) {
      this.yep()
      this.ask()
    } else {
      this.nope()
    }
  }

  yep() {
    this.$nope.classList.remove('show')
    this.$yep .classList.add   ('show')

    clearTimeout(this.id)
    this.id = setTimeout(() => this.$yep.classList.remove('show'), 300)
  }

  nope() {
    this.$yep .classList.remove('show')
    this.$nope.classList.add   ('show')

    clearTimeout(this.id)
    this.id = setTimeout(() => this.$nope.classList.remove('show'), 300)
  }

  onClickRoot() {
    this.setState({
      root: this.state.root
        ? null
        : this.props.mode.root
    })
  }

  onClickType(type) {
    if (type !== this.state.type) {
      this.setState({ type })

      this.player
        .opts({ type, speed: this.state.speed })
        .play(this.root, this.asked, true)
    }
  }

  onClickSpeed(speed) {
    if (speed !== this.state.speed) {
      this.setState({ speed })

      this.player
        .opts({ type: this.state.type, speed })
        .play(this.root, this.asked, true)
    }
  }

  onClickPlay() {
    this.player.play(this.root, this.asked, true)
  }
}

export default EarTrainingView
