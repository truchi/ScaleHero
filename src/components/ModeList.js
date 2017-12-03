import React, { Component } from 'react'
import Mode from './Mode'
import Label from './Label'

class ModeList extends Component {
  render() {
    return (
      <div className="ModeList">
        {this.props.name &&
          <div className="name">
            <Label txt={this.props.name} />
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
    )
  }
}

export default ModeList
