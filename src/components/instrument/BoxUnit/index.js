import React  from 'react'
import rcv    from '../../../lib/rcv'
import styles from './styles.module.scss'

const Unit = rcv(<rect />)

const defaults = {
  color: 'transparent',
}

export default ({ style, clip }) => (
  <Unit
    className={ styles.unit }
    rcv={{ ...defaults, ...style, clip }}
  />
)
