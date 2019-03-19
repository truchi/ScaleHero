import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './Box.module.css'

const Svg = rcv(<svg />)

class Box extends Component {
    prevRadius = '0%'

    render() {
        let { name, duration, href } = this.props
        const radius = this.props.styles(name).radius / 2 + '%'
        href = href(name)

        this.prevRadius = radius
        return (
            <box className={ styles.box }>
                <Svg className={ styles.svg } rcv={{ radius, duration }}>
                    <use className={ styles.use } href={ `#${ href }` } />
                </Svg>
            </box>
        )
    }
}

export default Box
