import React, { Component } from 'react'
import String from '../string/String'
import styles from './Layer.module.css'

class Layer extends Component {
    render() {
        return (
            <layer className={ styles.layer }>
                { this.props.strings.map((string, key) => (
                    <String { ...{ key } } { ...string } />
                )) }
            </layer>
        )
    }
}

export default Layer
