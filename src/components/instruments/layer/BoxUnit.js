import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './BoxUnit.module.css'

const Unit = rcv(<rect />)

class BoxUnit extends Component {
    render() {
        let   rcv  = this.props.styles || {}
        const clip = this.props.clip

        rcv = {
            ...rcv,
            clip,
            radius: rcv.radius ? rcv.radius /  2 + '%' : null
        }

        return (
            <Unit className={ styles.unit } rcv={ rcv }></Unit>
        )
    }
}

export default BoxUnit
