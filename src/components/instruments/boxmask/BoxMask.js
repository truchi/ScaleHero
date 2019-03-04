import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './BoxMask.module.css'

const Rect = rcv(<rect />)

class BoxMask extends Component {
    rcv    = {}
    states = {
        // paused : false,
        entering: false,
        entered : false,
        leaving : false,
        left    : false
    }

    constructor(props) {
        super(props)

        this.id        = this.props.id
        this.onEntered = this.props.onEntered || (_ => _)
        this.onLeft    = this.props.onLeft    || (_ => _)
    }

    events(action) {
        const method = action + 'EventListener'

        this.rcv.enter.$[method]('animationend', this.entered)
        this.rcv.leave.$[method]('animationend', this.left   )
    }

    componentDidMount() {
        this.events('add')
        this.animate()
    }

    componentDidUpdate() {
        this.animate()
    }

    componentWillUnmount() {
        this.events('remove')
    }

    animate() {
        if (!this.states.entered)
            this.enter()

        if (this.props.leave)
            this.leave()
    }

    enter() {
        if (this.states.entering) return

        this.states.entering = true
        this.rcv.enter({
            state: 'running'
        })
    }

    leave() {
        if (this.states.leaving) return

        this.states.leaving = true
        this.rcv.leave({
            state: 'running'
        })
    }

    entered = e => {
        this.states.entered = true
        this.onEntered(this, e)
    }

    left = e => {
        this.states.left = true
        this.onLeft(this, e)
    }

    render() {
        const id  = type => `${ this.id }-${ type }`
        const rcv = type => [ this.props.rcv, rcv => this.rcv[type] = rcv ]

        return (
            <>
                <clipPath id={ id('leave') } clipPathUnits="objectBoundingBox">
                    <Rect className={ styles.animation } x="0" y="0" width="1" height="1" rcv={ rcv('leave') } />
                </clipPath>
                <clipPath id={ id('enter') } clipPathUnits="objectBoundingBox">
                    <Rect className={ styles.animation } x="-1" y="0" width="1" height="1" rcv={ rcv('enter') } />
                </clipPath>
                <clipPath id={ id('shape') } clipPathUnits="objectBoundingBox">
                    <polygon points="0,0 0,1 1,1 1,0" />
                </clipPath>
            </>
        )
    }
}

export default BoxMask
