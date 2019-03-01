import React, { Component } from 'react'
import String from '../string/String'
import styles from './Layer.module.css'

class Layer extends Component {
    render() {
        return (
            <layer className={ styles.layer }>
                { this.props.strings.map(string => (
                    <String { ...string } />
                )) }
            </layer>
        )
    }
}

export default Layer
