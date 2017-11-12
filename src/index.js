import registerServiceWorker from './registerServiceWorker'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Guitar   from './components/Guitar'
import Note     from './models/Note'
import Mujsic   from './models/Mujsic'
import scales   from './models/scales'
import chords   from './models/chords'

window.SCALES = Mujsic.init(chords, scales).allScales()
console.log(window.SCALES)

const frets  = 15
const tuning = Note.fromNamesString('E A D G B E')
console.log(tuning)

console.log('----- HERE WE GO -----')
ReactDOM.render(<Guitar tuning={tuning} frets={frets} />, document.getElementById('root'))
registerServiceWorker()
