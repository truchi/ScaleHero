import React, { Component } from 'react'
import styled from 'styled-components'

class Fret extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let interval = this.props.mode.getDegree(this.props.note)

    if (interval) {
      interval = interval.name.full
    } else {
      interval = ''
    }

    return (
      <div>{interval}</div>
    )
  }
}

export default Fret
