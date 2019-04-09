import React  from 'react'
import rcv    from '../../../lib/rcv'
import styles from './styles.module.scss'

const Unit = rcv(<rect />)

export default ({ style, clip }) => (
  <Unit className={ styles.unit } rcv={{ ...style, clip }}></Unit>
)
