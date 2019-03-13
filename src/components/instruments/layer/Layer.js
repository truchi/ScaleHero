import React, { Component } from 'react'
import String from '../string/String'
import Box from './Box'
import BoxMask from './BoxMask'
import rcv from '../../../lib/rcv/rcv'
import entries from '../../../utils/entries'
import styles from './Layer.module.css'


class Layer extends Component {
    static #id       = 0
    static MAX_MASKS = 2
    static IDLE = 'idle'
    static BUSY = 'busy'
    id     = null
    #masks = {}

    constructor(props) {
        super(props)

        this.id = Layer.#id++

        for(let i = 0; i < Layer.MAX_MASKS; ++i) {
            const id = `${ this.id }-${ i }`

            this.#masks[id] = {
                id,
                state: Layer.IDLE,
                $    : (
                    <BoxMask id={ id } key={ id } enter={ BoxMask.DEFAULT } leave={ BoxMask.DEFAULT } onLeft={ this.remove } />
                )
            }
        }
    }

    remove = mask => {
        this.#masks[mask.id].state = Layer.IDLE
    }

    masks(enter, leave) {
        const current = Object.values(this.#masks).find(mask => mask.state === Layer.IDLE)
        if(!current) throw new Error(`${ Layer.MAX_MASKS } masks are not enough`)

        this.#masks = entries(this.#masks, entries => entries
            .map(([id, mask]) => [id, {
                id   : mask.id,
                state: mask.id === current.id ? Layer.BUSY : mask.state,
                $    : React.cloneElement(
                    mask.$,
                    mask.id === current.id
                        ? { animate: BoxMask.ENTER, enter, leave }
                        : { animate: BoxMask.LEAVE }
                )
            }])
        )

        return { current, masks: Object.values(this.#masks) }
    }

    render() {
        const { palette, shape, enter, leave } = this.props
        const { current, masks } = this.masks(enter, leave)

        return (
            <layer className={ styles.layer }>
                <svg className={ styles.svg } xmlns="http://www.w3.org/2000/svg">
                    { masks.map(mask => mask.$) }
                    {/* { Object.entries(palette).map(([key, styles]) => (
                        <Box id={ key } key={ key } styles={ styles } shape={ shape } enter={ enter } leave={ leave } />
                        )) } */}
                </svg>
            </layer>
        )
    }
}

export default Layer
