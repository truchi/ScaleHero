import React, { Component } from 'react'
import BoxUnit, { ENTER, LEAVE } from '../boxunit/BoxUnit.js'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './Box.module.css'

const B = rcv(<box></box>)

class Box extends Component {
    remove = (key) => {
        delete this.units[key]
    }

    render() {
        const key       = Math.random().toString(36).substr(2, 9)
        this.units      = this.units || {}
        this.units[key] =
            <BoxUnit id={ key } key={ key } rcv={ this.props } onLeft={ this.remove }></BoxUnit>

        return (
            <B className={ styles.box }>
                { Object.values(this.units).map(unit =>
                    React.cloneElement(unit, { animate: unit.key === key ? ENTER : LEAVE })
                )}
            </B>
        )
    }
}

export default Box
