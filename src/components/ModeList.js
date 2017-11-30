import React, { Component } from 'react'
import Mode from './Mode'

class ModeList extends Component {
  render() {
    return (
      <div className="ModeList">
        <div className="wrap">
          {this.props.name &&
            <div className="name">
              {this.props.name}
            </div>
          }
          {this.props.modes.map((mode, i) =>
            <Mode
              key={i}
              mode={mode}
              onChange={this.props.onChange}
            />
          )}
        </div>
      </div>
    )
  }
}

export default ModeList
