import React, { Component } from 'react'
import css from 'react-css-vars'

const Flat  = <span flat=''>H</span>
const Sharp = <span sharp=''>G</span>

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

    let base = item.base === '0' ? '' :  item.base
    let Accs = Array(Math.abs(item.accs)).fill(item.accs > 0 ? Sharp : Flat)

    return (
      <BoxEl
        onClick={this.props.onClick}
        {...this.attrs}
      >
        {item.constructor.name === 'Note'     && base}
        {Accs.map((Acc, key) => React.cloneElement(Acc, { key }))}
        {item.constructor.name === 'Interval' && base}
      </BoxEl>
    )
  }
}

export default Box
