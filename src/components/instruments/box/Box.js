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
    static MASKS = 3
    static IDLE  = 'idle'
    static BUSY  = 'busy'
    #list = []

    constructor(props) {
        super(props)

        this.id = `${ id() }-${ ++i }`

        // Minimize DOM io
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
                            alwaysProps  ={ this.maskAlwaysProps   }
                            activeProps  ={ this.maskActiveProps   }
                            inactiveProps={ this.maskInactiveProps }
                        />
                    </defs>
                    <ActivationList
                        Component   ={ BoxUnit     }
                        length      ={ this.length }
                        active      ={ idle        }
                        alwaysProps ={ this.unitAlwaysProps  }
                        activeProps ={ this.unitActiveProps  }
                    />
                </svg>
            </box>
        )
    }

    maskAlwaysProps = i => ({
        id      : type => `${ this.id }-${ i }-${ type }`,
        shape   : this.props.mask.shape,
        enter   : this.props.mask.enter,
        leave   : this.props.mask.leave,
        duration: this.props.duration,
        onLeft  : this.remove
    })

    maskActiveProps = i => ({
        animate: BoxMask.ENTER,
        radius : this.props.style.radius
    })

    maskInactiveProps = (i, prev) => ({
        animate: prev === i ? BoxMask.LEAVE : null
    })

    unitAlwaysProps = i => ({
        clip: `url("#${ this.id }-${ i }-mask")`
    })

    unitActiveProps = i => ({
        style: this.props.style
    })
}

export default Box
