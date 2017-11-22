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
    const scaleName =
      (this.props.showScaleName && this.props.mode.scale().name) || ''
    const modeName =
      (this.props.showModeName === false || this.props.mode.name) || ''

    return (
      <ModeEl>
        <div className="wrap">
          {scaleName &&
            <div className="name">{scaleName}</div>
          }
          {modeName &&
            <div className="name">{modeName}</div>
          }
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
