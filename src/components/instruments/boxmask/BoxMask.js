import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv'
import styles from './BoxMask.module.css'

const G       = rcv(<g />)
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
        const { g, mask: { clipPath, rect }, data } = this.renderData()

        return (
            <G { ...g }>
                <clipPath { ...clipPath }>
                    <Rect { ...rect } />
                </clipPath>
                { data.map(({ clipPath, polygon }) => (
                    <clipPath { ...clipPath }>
                        <Polygon { ...polygon } />
                    </clipPath>
                ))}
            </G>
        )
    }

    renderData() {
        const { angle, radius, duration } = this.props

        const id   = type => type ? `${ this.props.id }-${ type }` : null
        const url  = id   => id   ? `url("#${ id }")`              : null
        const clip = Object.fromEntries(
            [['shape', 'enter'], ['enter', 'leave']].map(([o, clip]) => [o, url(id(clip))])
        )

        const g = {
            className: styles.mask,
            rcv: {
                angle: `${ -angle }deg`,
                duration
            }
        }

        const mask = {
            clipPath: {
                id           : id('mask'),
                clipPath     : url(id('shape')),
                clipPathUnits: 'objectBoundingBox'
            },
            rect: {
                className: styles.ellipse,
                x     : '0',
                y     : '0',
                width : '1',
                height: '1',
                rcv   : { radius }
            }
        }

        const data = ['shape', 'enter', 'leave']
            .map(key => ({
                clipPath: {
                    key,
                    id           : id(key),
                    clipPath     : clip[key],
                    clipPathUnits: 'objectBoundingBox'
                },
                polygon: {
                    className: styles[key],
                    points   : this.props[key].shape,
                    rcv      : [
                        { width: `${ this.props[key].width }px` },
                        rcv => this.rcv[key] = rcv
                    ]
                },
            }))

        return { g, mask, data }
    }
}
