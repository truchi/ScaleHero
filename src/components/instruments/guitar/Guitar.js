import React, { Component } from 'react'
import Layer from '../layer/Layer'
import styles from './Guitar.module.css'

class Guitar extends Component {
    render() {
        return (
            <guitar className={ styles.guitar }>
                { this.props.layers.map((layer, i) => (
                    <Layer key={ i } { ...layer } />
                )) }
            </guitar>
        )
    }
}

export default Guitar
