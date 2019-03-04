import React, { Component } from 'react'
import String from '../string/String'
import BoxMask from '../boxmask/BoxMask'
import styles from './Layer.module.css'

class Layer extends Component {
    masks = {}

    remove = mask => {
        delete this.masks[mask.id]
    }

    render() {
        const key       = Math.random().toString(36).substr(2, 9)
        this.masks[key] =
            <BoxMask id={ key } key={ key } rcv={{ duration: this.props.duration }} onLeft={ this.remove }></BoxMask>

        return (
            <layer className={ styles.layer }>
                <svg className={ styles.svg } xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        { Object.values(this.masks).map(mask =>
                            React.cloneElement(mask, mask.key !== key ? { leave: true } : {})
                        )}
                    </defs>
                </svg>
                { this.props.strings.map(string => (
                    <String { ...string } maskKeys={ Object.keys(this.masks) }/>
                )) }
            </layer>
        )
    }
}

export default Layer
