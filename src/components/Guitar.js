import React, { Component } from 'react'
import styled from 'styled-components'
import String from './String'

const Tag = styled.div.attrs({
})`
  display: inline-block;
  background-color: ${props => props.theme.background};
`

class Guitar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Tag>
        {this.props.guitar.tuning.reverse().map((note, i) =>
          <String key={i} open={note} guitar={this.props.guitar}
                  scale={this.props.scale} />
        )}
      </Tag>
    )
  }
}

export default Guitar
