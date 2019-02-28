import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './Box.module.css'

const B = rcv(<box></box>)

class Box extends Component {
    render() {
        const clip      = this.props.clip
        const className = [styles.box, clip ? styles.clip : null].join(' ').trim()
        let rcv         = { ...this.props }
        rcv.border.radius = rcv.border.radius /  2 + '%'

        return (
            <B { ...{ className, rcv } }></B>
        )
    }
}

export default Box
