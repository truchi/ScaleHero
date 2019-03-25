import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv'
import randId from '../../../utils/randId'
import BoxMask from '../boxmask/BoxMask'
import BoxUnit from '../boxunit/BoxUnit'
import ActivationList from '../ActivationList'
import styles from './Box.module.css'

const id = randId(10)
let    i = 0

class Box extends Component {
    static MAX  = 2
    static IDLE = 'idle'
    static BUSY = 'busy'
    #list = []

    constructor(props) {
        super(props)

        this.id = `${ id() }-${ ++i }`

        for(let i = 0; i < Box.MAX; ++i)
            this.#list.push(Box.IDLE)
    }

    get idle() {
        const idle = this.#list.findIndex(state => state === Box.IDLE)
        console.log('%ccandidate', 'font-weight: bold', idle, JSON.stringify(this.#list))

        if(idle === -1)
            throw new Error(`${ Box.MAX } masks are not enough`)

        return idle
    }

    remove = mask => {
        this.#list[mask.props.i] = Box.IDLE
        console.log('REMOVED', JSON.stringify(this.#list))
    }

    render() {
        const idle = this.idle
        this.#list[idle] = Box.BUSY

        return (
            <box className={ styles.box }>
              <svg className={ styles.svg }>
                    <defs>
                        <ActivationList
                            Component    ={ BoxMask }
                            length       ={ Box.MAX }
                            active       ={ idle    }
                            initialProps ={ this.maskInitialProps  }
                            activeProps  ={ this.maskActiveProps   }
                            inactiveProps={ this.maskInactiveProps }
                        />
                    </defs>
                    <ActivationList
                        Component   ={ BoxUnit }
                        length      ={ Box.MAX }
                        active      ={ idle    }
                        initialProps={ this.unitInitialProps }
                        activeProps ={ this.unitActiveProps  }
                    />
                </svg>
            </box>
        )
    }

    maskInitialProps = i => ({
        id      : type => `${ this.id }-${ i }-${ type }`,
        shape   : this.props.mask.shape,
        enter   : this.props.mask.enter,
        leave   : this.props.mask.leave,
        duration: this.props.duration,
        onLeft  : this.remove
    })

    maskActiveProps = i => ({
        animate: BoxMask.ENTER
    })

    maskInactiveProps = (i, prev) => ({
        animate: prev === i ? BoxMask.LEAVE : null
    })

    unitInitialProps = i => ({
        clip: `url("#${ this.id }-${ i }-shape")`
    })

    unitActiveProps = i => ({
        style: this.props.style
    })
}

export default Box
