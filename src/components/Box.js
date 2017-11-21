import React, { Component } from 'react'
import css from 'react-css-vars'

const BoxEl = css({
  tag        : 'div'
, className  : 'Box'
, displayName: 'Box'
}, (props, $) => {
  if (props.selected) {
    $.classes.add('selected')
  } else {
    $.classes.remove('selected')
  }
})

class Box extends Component {
  render() {
    this.attrs = {
        selected: this.props.item._selected
      , base    : this.props.item.base
      , accs    : this.props.item.accs
    }

    return (
      <BoxEl onClick={this.props.onClick} {...this.attrs}>{this.props.item.name}</BoxEl>
    )
  }
}

export default Box
