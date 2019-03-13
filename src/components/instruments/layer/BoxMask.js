import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import entries from '../../../utils/entries'
import styles from './BoxMask.module.css'

const Polygon = rcv(<polygon />)

export default class BoxMask extends Component {
    static DEFAULT = { points: '', animation: {} }
    static ENTER   = 'enter'
    static LEAVE   = 'leave'
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
        const enter  = this.rcv.enter
        const leave  = this.rcv.leave

        enter && enter.$[method]('animationend', this.entered)
        leave && leave.$[method]('animationend', this.left   )
    }

    componentDidMount() {
        if (this.props.debug) return

        this.events('add')
        this.animate()
    }

    componentDidUpdate() {
        if (this.props.debug) return

        this.animate()
    }

    componentWillUnmount() {
        if (this.props.debug) return

        this.events('remove')
    }

    animate() {
        if (this.props.animate === BoxMask.ENTER)
            this.enter()

        if (this.props.animate === BoxMask.LEAVE)
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
        let { id, shape, enter, leave } = this.props
        const polygons = Object.entries(
            entries(
                { shape, enter, leave },
                entries => entries.filter(([type, data]) => data)
            )
        )

        return (
            <>
                { polygons.map(([type, data]) => (
                    <clipPath id={ `${ id }-${ type }` } key={ type } clipPathUnits="objectBoundingBox">
                        <Polygon
                            className={ styles[type] }
                            points   ={ data.points }
                            rcv      ={[ data.animation, rcv => this.rcv[type] = rcv ]}
                        />
                    </clipPath>
                ))}
            </>
        )
    }
}
