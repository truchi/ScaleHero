import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './Box.module.css'

const B = rcv(<box></box>)

class Box extends Component {
    render() {
        const clip      = this.props.clip
        const className = [styles.box, clip ? styles.clip : null].join(' ').trim()
        const rcv       = {
            color : this.props.color,
            radius: this.props.radius / 2 + '%',
            border: this.props.border,
            clip  : clip ? clip : null
        }

        return (
            <B { ...{ className, rcv } }></B>
        )
    }
}

export default Box
