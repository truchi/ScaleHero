import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import registerServiceWorker from './registerServiceWorker'
import Guitar from './components/instruments/guitar/Guitar'

const makeArray = (length = 0, fn = null) => {
    return new Array(length)
        .fill()
        .map((undef, index) => index)
        .map(fn ? fn : i => i)
}

const guitar = {
    layers: makeArray(2, layer => ({
        strings: makeArray(6, string => ({
            boxes: makeArray(12, i => ({
                'color': i % 2 === 0 ? 'red' : 'blue',
                'radius': 50,
            }))
        }))
    }))
}

/* const guitar = {
 *     layers: [
 *         {
 *             strings: [
 *                 {
 *                     boxes: [
 *                         { '--bg': 'blue' },
 *                         { '--bg': 'red' }
 *                     ]
 *                 }
 *             ]
 *         }
 *     ]
 * } */

console.log('----- HERE WE GO -----')
ReactDOM.render(
    <Guitar { ...guitar }/>,
    document.getElementById('root'))
registerServiceWorker()
