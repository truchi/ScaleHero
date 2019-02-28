import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

export default (element) =>
    class extends Component {
        static displayName = `RCV(${ element.type })`

        componentDidMount() {
            this.css()
        }

        componentDidUpdate() {
            this.css()
        }

        css() {
            const $   = findDOMNode(this)
            const rcv = this.props.rcv
            if (!$ || !rcv) return

            Object.entries(rcv)
                .forEach(([key, value]) => $.style.setProperty(`--${ key }`, value))
        }

        render() {
            return React.cloneElement(element, this.props)
        }
    }
