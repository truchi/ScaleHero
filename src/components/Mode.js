import React, { Component } from 'react'
import css from 'react-css-vars'
import Box from './Box'

const ModeEl = css({
  tag        : 'div'
, className  : 'Mode'
, displayName: 'Mode'
})

class Mode extends Component {
  render() {
    return (
      <ModeEl>
        <div className="wrap">
          {this.props.showScaleName &&
            <div className="name">
              {this.props.mode.scale().name}
            </div>
          }
          <div className="name">
            {this.props.mode.name}
          </div>
          <div className="intervals">
            {this.props.mode.intvs.map((intv, i) => {
              if (['1', '3', '5', '7'].includes(intv.base)) {
                intv._selected = true
              }

              return <Box
                key={i}
                item={intv}
              />
            })}
          </div>
        </div>
      </ModeEl>
    )
  }
}

export default Mode
