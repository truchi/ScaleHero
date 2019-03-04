import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
const flatObject = (o, prefix = '') =>
    Object.entries(o)
        .reduce((o, [key, value]) => {
            if (value === null || value === undefined) return o

            prefix && (key = prefix + capitalize(key))
            return typeof value === 'object'
                ? { ...o, ...flatObject(value, key) }
                : { ...o, [key]: value }
        }, {})

export default element =>
    class extends Component {
        static displayName = `RCV(${ element.type })`
        rcv = {}

        constructor(props) {
            super(props)

            const rcv = this.props.rcv
            if (Array.isArray(rcv)) {
                this.rcv = rcv[0] || this.rcv

                if (typeof rcv[1] === 'function') rcv[1](this.css)
            } else {
                this.rcv = rcv || {}
            }
        }

        componentDidMount() {
            this.css()
        }

        componentDidUpdate() {
            this.css()
        }

        css = (styles) => {
            const $   = findDOMNode(this)
            const rcv = styles || this.rcv

            if (!$) return

            this.css.$ = $
            Object
                .entries(flatObject(rcv))
                .forEach(([key, value]) => $.style.setProperty(`--${ key }`, value))
        }

        render() {
            return React.cloneElement(element, this.props)
        }
    }
