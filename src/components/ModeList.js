import React, { Component } from 'react'
import css from 'react-css-vars'
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
              showScaleName={this.props.showScalesName}
              showModeName={this.props.showModesName}
            />
          )}
        </div>
      </div>
    )
  }
}

export default ModeList
