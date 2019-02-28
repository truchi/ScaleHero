import React, { Component } from 'react'
import css from 'react-css-vars'
import Label from './Label'

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
    const item = this.props.item

    this.attrs = {
        selected: item._selected
      , base    : item.base
      , accs    : item.accs
    }

    return (
      <BoxEl
        onClick={this.props.onClick}
        {...this.attrs}
      >
        <Label txt={item.name} />
      </BoxEl>
    )
  }
}

export default Box
