import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './BoxMask.module.css'

const Polygon = rcv(<polygon />)

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
        if (this.props.debug) return this.debug()

        return (
            <>
                {[ 'leave', 'enter', 'shape' ].map(type => (
                    <clipPath id={ `${ this.id }-${ type }` } key={ type } clipPathUnits="objectBoundingBox">
                        <Polygon
                            className={ styles[type] }
                            points   ={ this.props.rcv[type].points }
                            rcv      ={[ this.props.rcv[type].animation, rcv => this.rcv[type] = rcv ]}
                        />
                    </clipPath>
                ))}
            </>
        )
    }

    debug() {
        const w = 80
        const h = 60
        const view  = this.debugView(w, h)
        const rcv   = this.props.rcv
        const debug = rcv.debug

        const shape   = { text: 'Shape'  , points: rcv.shape.points }
        const rotated = { text: 'Rotated', points: debug.rotated    }
        const boxed   = { text: 'Boxed'  , points: debug.boxed      }
        const enter   = {
            text     : 'Enter',
            points   : rcv.enter.points,
            className: styles.enter,
            style    : { animationIterationCount: 'infinite' },
            rcv      : { ...rcv.enter.animation, state: 'running' }
        }
        const leave = {
            text     : 'Leave',
            points   : rcv.leave.points,
            className: styles.leave,
            style    : { animationIterationCount: 'infinite' },
            rcv      : { ...rcv.leave.animation, state: 'running' }
        }

        let text  = `${ debug.s } ${ debug.type } ${ debug.trans }`
            text += ` -- angle: ${ debug.angle };`
            text += ` dir: ${ debug.dir };`
            text += ` size: ${ debug.size };`
            text += ` center: ${ rcv.enter.animation.origin }`
        return (
            <svg debug="debug" width={ 15 * w } height={ 4 * h } style={{ backgroundColor: '#222', border: '1px dotted gold', marginTop: `${ h / 2 }px` }}>
                <g transform={ `translate(${ w / 2 }, ${ h / 2 })` }>
                    <text fill="white" x="0" y={ h / 4 }>{ text }</text>
                    { view(shape) }
                    { view(rotated) }
                    { view(boxed) }
                    { view(enter) }
                    { view(leave) }
                </g>
            </svg>
        )
    }

    debugView(w, h) {
        let i = 0
        return ({ text, className, style, points, rcv }) => (
            <svg x={ i++ * 3 * w } y={ h / 2 }>
                <text y={ h / 4 } fill="white">{ text }</text>
                <g transform={  `translate(0 ${ h / 2 })` }>
                    <rect width={ 2 * w } height={ 2 * h } fill="red" />
                    <g transform={ `scale(${ w } ${ h }) translate(.5 .5)` }>
                        <Polygon
                            className={ className }
                            style    ={ style }
                            points   ={ points }
                            rcv      ={ rcv }
                            fill     ="green"
                        />
                    </g>
                    <rect x={ w / 2 } y={ h / 2 } width={ w } height={ h } fill="transparent" stroke="gold" strokeWidth="1" />
                </g>
            </svg>
        )
    }
}

export default BoxMask
