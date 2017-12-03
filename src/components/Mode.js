import React, { Component } from 'react'
import css from 'react-css-vars'
import Box from './Box'
import Label from './Label'

const ModeEl = css({
  tag        : 'div'
, className  : 'Mode'
, displayName: 'Mode'
})

class Mode extends Component {
  onClick() {
    if (this.props.onChange) {
      this.props.onChange(this.props.mode)
    }
  }

  render() {
    const name = this.props.mode.name

    return (
      <ModeEl>
        <div onClick={this.onClick.bind(this)}>
          <div className="name">
            {name ?
              <Label txt={name} />
            : '?'}
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
