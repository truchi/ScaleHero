import React, { Component } from 'react'
import BoxUnit, { ENTER, LEAVE } from '../boxunit/BoxUnit.js'
import styles from './Box.module.css'

class Box extends Component {
    _units = {}

    units() {
        // Remove old
        const maskKeys = this.props.maskKeys
        for (let unitKey in this._units)
            if (!maskKeys.includes(unitKeys))
                delete this._units[unitKey]

        // Add new
        const unitKeys = Object.keys(this._units)
        maskKeys
            .filter(maskKey => !unitKeys.includes(maskKey))
            .forEach(key =>
                this._units[key] =
                    <BoxUnit id={ key } key={ key } rcv={ this.props.rcv }></BoxUnit>
            )

        return Object.values(this._units)
    }

    render() {
        return (
            <box className={ styles.box }>
                { this.units() }
            </box>
        )
    }
}

export default Box
