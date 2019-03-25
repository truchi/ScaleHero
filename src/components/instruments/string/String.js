import React, { Component } from 'react'
import Box from '../box/Box'
import styles from './String.module.css'

class String extends Component {
    render() {
        return (
            <string className={ styles.string }>
                { this.props.boxes.map(({ style, mask, duration }, i) => (
                    <Box key={ i } style={ style } mask={ mask } duration={ duration } />
                )) }
            </string>
        )
    }
}

export default String
