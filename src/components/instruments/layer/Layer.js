import React, { Component } from 'react'
import ActivationList from './ActivationList'
import BoxMask from './BoxMask'
import BoxUnit from './BoxUnit'
import String from '../string/String'
import styles from './Layer.module.css'

class Layer extends Component {
    static #id  = 0
    static MAX  = 3
    static IDLE = 'idle'
    static BUSY = 'busy'
    id          = Layer.#id++
    #list       = []

    constructor(props) {
        super(props)

        const { shape, enter, leave, duration, palette } = this.props
        this.shape    = shape
        this.enter    = enter
        this.leave    = leave
        this.duration = duration
        this.keys     = Object.keys(palette)

        for(let i = 0; i < Layer.MAX; ++i)
            this.#list.push(Layer.IDLE)
    }

    getId(i) {
        return type => `${ this.id }-${ i }-${ type }`
    }

    getCandidate() {
        const candidate = this.#list.findIndex(state => state === Layer.IDLE)
        console.log('%ccandidate', 'font-weight: bold', candidate, JSON.stringify(this.#list))

        if(candidate === -1)
            throw new Error(`${ Layer.MAX } masks are not enough`)

        return candidate
    }

    maskInitialProps = i => ({
        id      : this.getId(i),
        shape   : this.shape,
        enter   : this.enter,
        leave   : this.leave,
        duration: this.duration,
        onLeft  : this.remove
    })

    maskActiveProps = i => ({
        animate: BoxMask.ENTER
    })

    maskInactiveProps = (i, prev) => ({
        animate: prev === i ? BoxMask.LEAVE : null
    })

    unitInitialProps = key => i => ({
        // If palette doesn't change much
        // we have less style attributes to change
        // by setting them all at first
        styles: {
            ...this.props.palette[key],
        },
        clip: `url("#${ this.getId(i)('shape') }")`
    })

    unitActiveProps = key => i => ({
        styles: {
            ...this.props.palette[key],
        }
    })

    remove = mask => {
        this.#list[mask.props.i] = Layer.IDLE
        console.log('removing', mask.props.i, JSON.stringify(this.#list))
    }

    render() {
        const candidate = this.getCandidate()
        this.#list[candidate] = Layer.BUSY

        return (
            <layer className={ styles.layer }>
                <svg className={ styles.svg }>
                    <defs>
                        <ActivationList
                            Component    ={ BoxMask   }
                            length       ={ Layer.MAX }
                            active       ={ candidate }
                            initialProps ={ this.maskInitialProps  }
                            activeProps  ={ this.maskActiveProps   }
                            inactiveProps={ this.maskInactiveProps }
                        />
                        { this.keys.map(key => (
                            <g id={ this.getId('box')(key) } key={ key }>
                                <ActivationList
                                    Component   ={ BoxUnit   }
                                    length      ={ Layer.MAX }
                                    active      ={ candidate }
                                    initialProps={ this.unitInitialProps(key) }
                                    activeProps ={ this.unitActiveProps (key) }
                                />
                            </g>
                        ))}
                    </defs>
                </svg>
                { this.props.strings.map((string, i) => (
                    <String key={ i } { ...string } />
                )) }
            </layer>
        )
    }
}

export default Layer
