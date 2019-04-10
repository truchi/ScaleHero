import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
const flatObject = (o, prefix = '') =>
  Object.entries(o)
    .reduce((o, [key, value]) => {
      prefix && (key = prefix + capitalize(key))

      if (value === null || value === undefined)
        return { ...o, [key]: null }

      return typeof value === 'object'
           ? { ...o, ...flatObject(value, key) }
           : { ...o, [key]: value }
    }, {})

export default element =>
  class extends Component {
    static displayName = `RCV(${ element.type })`

    componentDidMount() {
      this.css()
    }

    componentDidUpdate() {
      this.css()
    }

    getStyles(styles) {
      if (styles) return styles

      styles = this.props.rcv

      if (Array.isArray(styles))
        styles = styles[0]

      return styles || {}
    }

    css = (styles) => {
      const $ = findDOMNode(this)
      if (!$) return

      this.$ = $
      styles = flatObject(this.getStyles(styles))

      Object
        .entries(styles)
        .forEach(([key, value]) => $.style.setProperty(`--${ key }`, value))
    }

    render() {
      const props = { ...this.props }
      delete props.rcv

      return React.cloneElement(element, props)
    }
  }
