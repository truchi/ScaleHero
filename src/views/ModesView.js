import React, { Component } from 'react'
import ModeList from '../components/ModeList'

class ModesView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      key: Object.keys(this.props.groups)[0]
    }
  }

  show(key) {
    this.setState({ key })
  }

  render() {
    const groups = Object.entries(this.props.groups)
    const titles = groups.map(([key, group]) => {
      return {
        title: group.title
      , shown: key === this.state.key ? ' shown' : ''
      , key  : key
      }
    })
    let shownScales = groups.length
      ? groups.filter(([key, group]) => {
        return key === this.state.key
      })[0][1].lists
      : []

    return (
      <div className="ModesView">
        <div className="titles">
          {titles.map(title =>
            <div
              className={'title' + title.shown}
              key={title.key}
              onClick={this.show.bind(this, title.key)}
            >
              {title.title}
            </div>
          )}
        </div>
        <div className="lists">
          {shownScales.map(list =>
            <ModeList
              key={list.name}
              name={list.name}
              modes={list.modes}
            />
          )}
        </div>
      </div>
    )
  }
}

export default ModesView
