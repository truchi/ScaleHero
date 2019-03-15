import React, { Component } from 'react'
import BoxUnit from '../boxunit/BoxUnit.js'
import styles from './Box.module.css'

class Box extends Component {
    render() {
        return (
            <box className={ styles.box }>
                <svg className={ styles.svg }>
                    <use className={ styles.use } href={ `#0-box-3` } />
                </svg>
            </box>
        )
    }
}

export default Box
