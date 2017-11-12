import React, { Component } from 'react'
import { ThemeProvider } from 'styled-components'
import appTheme from './themes/App'
import guitarTheme from './themes/Guitar'
import selectorTheme from './themes/Selector'
import Guitar from './Guitar'
import Selector from './Selector'
import Note from '../models/Note'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      guitar: {
        frets : 15
      , tuning: Note.fromNamesString('E A D G B E').reverse()
      }
    , scale: {
        root: new Note('C')
      , mode: window.SCALES[15].modes[0]
      }
    }
  }

  onScaleChange(scale) {
    this.setState({ scale })
  }

  render() {
    return (
      <ThemeProvider theme={appTheme}>
        <div>
          <ThemeProvider theme={guitarTheme}>
            <Guitar guitar={this.state.guitar} scale={this.state.scale} />
          </ThemeProvider>
          <ThemeProvider theme={selectorTheme}>
            <Selector scale={this.state.scale} onChange={this.onScaleChange.bind(this)} />
          </ThemeProvider>
        </div>
      </ThemeProvider>
    )
  }
}

export default App
