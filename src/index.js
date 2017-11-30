import './styles/index.css'
import registerServiceWorker from './registerServiceWorker'
import React from 'react'
import ReactDOM from 'react-dom'
import App      from './views/App'

import MuJS from 'mujs'
window.DICT = MuJS.Dict.scales()
console.log(window.DICT);

console.log('----- HERE WE GO -----')
ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
