import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './Box.module.css'

const B = rcv(<box></box>)

class Box extends Component {
    render() {
        const rcv = {
            color: this.props.color,
            radius: this.props.radius / 2 + '%',
        }

        return (
            <B className={ styles.box } { ...{ rcv } }></B>
        )
    }
}

export default Box
