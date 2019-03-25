import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './BoxUnit.module.css'

const Unit = rcv(<rect />)

class BoxUnit extends Component {
    render() {
        const { style, clip } = this.props
        const rcv = { ...style, clip }

        return (
            <Unit className={ styles.unit } rcv={ rcv }></Unit>
        )
    }
}

export default BoxUnit
