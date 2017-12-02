import React, { Component } from 'react'
import ModeList from '../components/ModeList'

class ModesView extends Component {
  constructor(props) {
    super(props)

    const scales = {}
    this.props.dict.forEach(scale => {
      const length = scale.intvs.length

      scales[length] = !scales[length] ? [] : scales[length]
      scales[length].push(scale)
    })

    this.state = {
      scales
    , show: Object.keys(scales)[0]
    }
  }

  show(length) {
    this.setState({ show: length })
  }

  render() {
    const allScales   = Object.entries(this.state.scales)
    const shownScales = this.state.scales[this.state.show]

    return (
      <div className="ModesView">
        <div className="titles">
          {allScales.map(([length, scales], i) =>
            <div
              className={'title' + (length === this.state.show ? ' shown' : '')}
              key={i}
              onClick={this.show.bind(this, length)}
            >
              {length} notes
            </div>
          )}
        </div>
        <div className="lists">
          {shownScales.map((scale, i) =>
            <ModeList
              key={scale.name}
              name={scale.name}
              modes={scale.modes}
            />
          )}
        </div>
      </div>
    )
  }
}

export default ModesView
