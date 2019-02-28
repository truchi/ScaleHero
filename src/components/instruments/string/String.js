import React, { Component } from 'react'
import Box from '../box/Box'
import styles from './String.module.css'

class String extends Component {
    render() {
        return (
            <string className={ styles.string }>
                { this.props.boxes.map((box, key) => (
                    <Box { ...{ key } } { ...box } />
                )) }
            </string>
        )
    }
}

export default String
