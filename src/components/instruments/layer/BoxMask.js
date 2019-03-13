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
        let { id, animate, enter, leave } = this.props

        const defaultData = { points: '', animation: {} }
        animate = animate || ''
        enter   = enter   || defaultData
        leave   = leave   || defaultData

        return (
            <>
                { Object.entries({ enter, leave }).map(([type, data]) => (
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
/* {[ 'leave', 'enter', 'shape' ].map(type => (
 *     <clipPath id={ `${ this.id }-${ type }` } key={ type } clipPathUnits="objectBoundingBox">
 *         <Polygon
 *             className={ styles[type] }
 *             points   ={ this.props.rcv[type].points }
 *             rcv      ={[ this.props.rcv[type].animation, rcv => this.rcv[type] = rcv ]}
 *         />
 *     </clipPath>
 * ))} */

export default BoxMask
