import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './BoxUnit.module.css'

const ENTER    = 'enter'
const ENTERING = 'entering'
const ENTERED  = 'entered'
const LEAVE    = 'leave'
const LEAVING  = 'leaving'
const LEFT     = 'left'
const B = rcv(<boxunit></boxunit>)

class BoxUnit extends Component {
    componentDidMount() {
        this.enter()
    }

    componentDidUpdate() {
        const animate = this.props.animate

        if      (animate === ENTER) this.enter()
        else if (animate === LEAVE) this.leave()
    }

    enter() {
        if (this.animationState === ENTERING)
            return this

        this.animationState = ENTERING
        setTimeout(() => {
            this.animationState = ENTERED
        }, 1000)

        return this
    }

    leave() {
        if (this.animationState === LEAVING)
            return this

        this.animationState = LEAVING
        setTimeout(() => {
            this.animationState = LEFT
            this.props.onLeft(this.props.id)
        }, 1000)

        return this
    }

    render() {
        let rcv = this.props.rcv
        rcv     = {
            ...rcv,
            border: {
                ...rcv.border,
                radius: rcv.border.radius /  2 + '%'
            }
        }
        const clip      = rcv.clip
        const className = [styles.boxUnit, clip ? styles.clip : null].join(' ').trim()

        return (
            <B { ...{ className, rcv } }></B>
        )
    }
}

export { ENTER, LEAVE }
export default BoxUnit
