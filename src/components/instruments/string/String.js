import React, { Component } from 'react'
import Box from '../box/Box'
import styles from './String.module.css'

class String extends Component {
    render() {
        return (
            <string className={ styles.string }>
                { this.props.boxes.map(box => (
                    <Box key={ box.key } rcv={ box.styles } maskKeys={ this.props.maskKeys } />
                )) }
            </string>
        )
    }
}

export default String