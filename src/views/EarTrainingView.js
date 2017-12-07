import React, { Component } from 'react'
import Keyboard from '../components/Keyboard'

class EarTrainingView extends Component {
  render() {
    const mode = this.props.mode

    return (
      <div className='EarTrainingView'>
        <Keyboard
          mode={mode}
        />
      </div>
    )
  }
}

export default EarTrainingView
