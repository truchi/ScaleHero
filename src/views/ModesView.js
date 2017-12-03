import React, { Component } from 'react'
import ModeList from '../components/ModeList'

class ModesView extends Component {
  constructor(props) {
    super(props)

    this._internal = false
  }

  show(current) {
    this._internal = true
    this.setState({ current })
  }

  getCurrent() {
    let current

    if (this._internal) {
      current = this.state.current
      this._internal = false
    } else {
      current = this.props.current
    }

    return current
  }

  render() {
    const current = this.getCurrent()
    const groups  = Object.entries(this.props.groups)
    const titles  = groups.map(([key, group]) => {
      return {
        title: group.title
      , shown: key === current ? ' shown' : ''
      , key  : key
      }
    })
    let shownScales = groups.length
      ? groups.filter(([key, group]) => {
        return key === current
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
              onChange={this.props.onChange}
            />
          )}
        </div>
      </div>
    )
  }
}

export default ModesView
