import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './BoxMask.module.css'

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
        this.states.entering = false
        this.states.entered  = true
        this.onEntered(this, e)
    }

    left = e => {
        this.states.leaving = false
        this.states.left    = true
        this.onLeft(this, e)
    }

    render() {
        let { id, shape, enter, leave, duration } = this.props

        const defaults = { points: '', animation: { duration } }
        id    = id || (_ => _)
        shape = { ...defaults, ...shape }
        enter = { ...defaults, ...enter }
        leave = { ...defaults, ...leave }

        shape.clip = id('enter')
        enter.clip = id('leave')

        return (
            <>
              { Object.entries({ shape, enter, leave }).map(([type, data]) => (
                  <clipPath
                      id           ={ id(type) }
                      key          ={ type }
                      clipPathUnits="objectBoundingBox"
                      clipPath     ={ data.clip ? `url("#${ data.clip }")` : null }
                  >
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
