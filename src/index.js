import './styles/index.css'
import registerServiceWorker from './registerServiceWorker'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './views/App'
import MuJS from 'mujs'

const dict   = MuJS.Dict.scales()
const mode   = dict[15].modes[0]
const guitar = {
  frets : 15
, tuning: MuJS.utils.str2items(MuJS.Note, 'E A D G B E').reverse()
}

console.log('----- HERE WE GO -----')
ReactDOM.render(
  <App
    dict={dict}
    guitar={guitar}
    mode={mode}
  />
, document.getElementById('root'))
registerServiceWorker()
