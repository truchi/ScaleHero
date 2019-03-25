import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv'
import styles from './BoxMask.module.css'

const Rect    = rcv(<rect />)
const Polygon = rcv(<polygon />)

export default class BoxMask extends Component {
    static ENTER = 'enter'
    static LEAVE = 'leave'
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

        this.onEntered = this.props.onEntered || (_ => _)
        this.onLeft    = this.props.onLeft    || (_ => _)
    }

    events(action) {
        const method = action + 'EventListener'

        this.rcv.enter.$[method]('transitionend', this.entered)
        this.rcv.leave.$[method]('transitionend', this.left   )
    }

    componentDidMount() {
        this.events('add')
        this.animate(true)
    }

    componentDidUpdate() {
        this.animate()
    }

    componentWillUnmount() {
        this.events('remove')
    }

    animate(delay = false) {
        const animate = () => {
            if (this.props.animate === BoxMask.ENTER)
                this.enter()

            if (this.props.animate === BoxMask.LEAVE)
                this.leave()
        };

        delay ? setTimeout(animate) : animate()
    }

    enter() {
        if (this.states.entering) return

        this.states.entering = true
        this.rcv.leave.$.classList.remove(styles.to)
        this.rcv.enter.$.classList.add(styles.to)
    }

    leave() {
        if (this.states.leaving) return

        this.states.leaving = true
        this.rcv.leave.$.classList.add(styles.to)
    }

    entered = e => {
        if (!this.states.entering) return

        this.states.entering = false
        this.states.entered  = true

        this.onEntered(this, e)
    }

    left = e => {
        if (!this.states.leaving) return

        this.states.leaving = false
        this.states.left    = true

        this.rcv.enter.$.classList.remove(styles.to)
        this.onLeft(this, e)
    }

    render() {
        let { id, shape, enter, leave, radius, duration } = this.props

        const url      = id => `url("#${ id }")`
        const noop     = _ => _
        const defaults = { points: '', animation: { duration } }
        const sanitize = data => {
            data           = { ...defaults, ...data }
            data.animation = { ...defaults.animation, ...data.animation }
            data.rcvFn     = type => rcv => this.rcv[type] = rcv

            return data
        }

        id    = id || noop
        shape = sanitize(shape)
        enter = sanitize(enter)
        leave = sanitize(leave)

        shape.clip = id('enter')
        enter.clip = id('leave')

        shape.rcvFn = noop
        shape.animation.duration = null

        return (
            <>
                <clipPath
                    id           ={ id('mask') }
                    clipPathUnits="objectBoundingBox"
                    clipPath     ={ url(id('shape')) }
                >
                    <Rect
                        className={ styles.ellipse }
                        x        ="0"
                        y        ="0"
                        width    ="1"
                        height   ="1"
                        rcv      ={{ radius }}
                    />
                </clipPath>
                { Object.entries({ shape, enter, leave }).map(([type, data]) => (
                    <clipPath
                        id           ={ id(type) }
                        key          ={ type }
                        clipPathUnits="objectBoundingBox"
                        clipPath     ={ data.clip ? url(data.clip) : null }
                    >
                        <Polygon
                            className={ styles[type] }
                            points   ={ data.points }
                            rcv      ={[ data.animation, data.rcvFn(type) ]}
                        />
                    </clipPath>
                ))}
            </>
        )
    }
}
