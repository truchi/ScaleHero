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
    static MASKS = 2
    static IDLE  = 'idle'
    static BUSY  = 'busy'
    #list = []

    constructor(props) {
        super(props)

        this.id = `${ id() }-${ ++i }`

        // Minimize DOM writes
        for(let i = 0; i < Box.MASKS; ++i)
            this.#list.push(Box.IDLE)
    }

    get length() {
        return this.#list.length
    }

    get idle() {
        let idle = this.#list.findIndex(state => state === Box.IDLE)

        if(idle === -1) {
            this.#list.push(Box.IDLE)
            idle = this.length - 1
        }
        console.log('%ccandidate', 'font-weight: bold', idle, JSON.stringify(this.#list))

        return idle
    }

    remove = mask => {
        this.#list[mask.props.i] = Box.IDLE
        console.log('REMOVED', mask.props.i, JSON.stringify(this.#list))
    }

    render() {
        const idle = this.idle
        this.#list[idle] = Box.BUSY

        return (
            <box className={ styles.box }>
              <svg className={ styles.svg }>
                    <defs>
                        <ActivationList
                            Component    ={ BoxMask     }
                            length       ={ this.length }
                            active       ={ idle        }
                            initialProps ={ this.maskInitialProps  }
                            activeProps  ={ this.maskActiveProps   }
                            inactiveProps={ this.maskInactiveProps }
                        />
                    </defs>
                    <ActivationList
                        Component   ={ BoxUnit     }
                        length      ={ this.length }
                        active      ={ idle        }
                        initialProps={ this.unitInitialProps }
                        activeProps ={ this.unitActiveProps  }
                    />
                </svg>
            </box>
        )
    }

    maskInitialProps = i => ({
        id      : `${ this.id }-${ i }`,
        duration: this.props.duration,
        angle   : this.props.mask.angle,
        shape   : this.props.mask.shape,
        enter   : { shape: '', width: 0 },
        leave   : { shape: '', width: 0 },
        onLeft  : this.remove
    })

    maskActiveProps = i => ({
        animate: BoxMask.ENTER,
        enter  : this.props.mask.enter,
        leave  : this.props.mask.leave,
        radius : this.props.style.radius
    })

    maskInactiveProps = (i, prev) => ({
        animate: prev === i ? BoxMask.LEAVE : null
    })

    unitInitialProps = i => ({
        clip: `url("#${ this.id }-${ i }-mask")`
    })

    unitActiveProps = i => ({
        style: this.props.style
    })
}

export default Box
