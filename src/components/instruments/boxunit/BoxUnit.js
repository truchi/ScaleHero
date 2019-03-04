import React, { Component } from 'react'
import rcv from '../../../lib/rcv/rcv.js'
import styles from './BoxUnit.module.css'

const Unit  = rcv(<boxunit></boxunit>)
const Enter = rcv(<div></div>)
const Leave = rcv(<div></div>)

class BoxUnit extends Component {
    render() {
        const clip = type => ({ clip: `url("#${ this.props.id }-${ type }")` })
        let   rcv  = this.props.rcv
        rcv        = {
            ...rcv,
            border: {
                ...rcv.border,
                radius: rcv.border.radius ? rcv.border.radius /  2 + '%' : null
            }
        }

        return (
            <Leave className={ styles.leave } rcv={ clip('leave') }>
                <Enter className={ styles.enter } rcv={ clip('enter') }>
                    <Unit className={ styles.boxUnit } rcv={{ ...rcv, ...clip('shape') }}></Unit>
                </Enter>
            </Leave>
        )
    }
}

export default BoxUnit
