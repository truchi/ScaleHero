import React, { Component } from 'react'
import Guitar from '../components/Guitar'
import Selector from '../components/Selector'
import Mode from '../components/Mode'

class BoardView extends Component {
  render() {
    const mode     = this.props.mode
    const guitar   = this.props.guitar
    const onChange = this.props.onChange

    return (
      <div className="BoardView">
        <Mode
          mode={mode}
        />
        <Guitar
          guitar={guitar}
          mode={mode}
        />
        <Selector
          mode={mode}
          onChange={onChange}
        />
      </div>
    )
  }
}

export default BoardView