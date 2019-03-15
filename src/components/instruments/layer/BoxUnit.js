import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './BoxUnit.module.css'

const Unit = rcv(<rect></rect>)

class BoxUnit extends Component {
    render() {
        let   rcv  = this.props.styles || {}
        const clip = this.props.clip

        rcv.border = rcv.border || {}
        rcv = {
            ...rcv,
            clip,
            border: {
                ...rcv.border,
                radius: rcv.border.radius ? rcv.border.radius /  2 + '%' : null
            }
        }

        return (
            <Unit className={ styles.unit } rcv={ rcv }></Unit>
        )
    }
}

export default BoxUnit
