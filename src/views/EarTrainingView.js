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

    this.player   = new IntervalPlayer(this.state)
    this.answered = this.answered.bind(this)
  }

  render() {
    this.ask()

    return (
      <div className='EarTrainingView'>
        <Keyboard
          mode={this.props.mode}
          onClick={this.answered}
        />
      </div>
    )
  }

  ask() {
    const root  = this.state.root || this._random(ROOTS)
    this.asked  = this._random(this.props.mode.intvs)

    this.player.play(root, this.asked)
  }

  answered(intv) {
    if (!intv) return

    if (this.asked.semi === intv.semi) this.ask()
  }

  _random(arr) {
    return arr[Math.floor(Math.random() * arr.length - 1) + 1]
  }
}

export default EarTrainingView
