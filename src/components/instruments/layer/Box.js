import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'

const Polygon = rcv(<polygon />)

export default class Box extends Component {
    render() {
        const { shape, enter, leave } = this.props
        console.log(shape, enter, leave)

        return (
            <>
                <Polygon points={ shape.points } />
            </>
        )
    }
}
