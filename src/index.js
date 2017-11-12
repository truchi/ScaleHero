import registerServiceWorker from './registerServiceWorker'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App      from './components/App'
import Note     from './models/Note'
import Mujsic   from './models/Mujsic'
import scales   from './models/scales'
import chords   from './models/chords'

window.SCALES = Mujsic.init(chords, scales).allScales()
console.log(window.SCALES)

console.log('----- HERE WE GO -----')
ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
