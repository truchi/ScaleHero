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

const randArray = array => array[Math.floor(Math.random() * array.length)]
const flatArray = array => Array.prototype.concat.apply([], array)
const flatMapArray = (array, fn) => flatArray(array.map(fn))
const polys = {
    top           : s => `0% 0%, 100% 0%, 100% ${ s }%, 0% ${ s }%`,
    horizontal    : s => `0% ${ 50 - s / 2 }%, 0% ${ 50 + s / 2 }%, 100% ${ 50 + s / 2 }%, 100% ${ 50 - s / 2 }%`,
    bottom        : s => `0% ${ s }%, 100% ${ s }%, 100% 100%, 0% 100%`,
    left          : s => `0% 0%, ${ s }% 0%, ${ s }% 100%, 0% 100%`,
    vertical      : s => `${ 50 - s / 2 }% 0%, ${ 50 + s / 2 }% 0%, ${ 50 + s / 2 }% 100%, ${ 50 - s / 2 }% 100%`,
    right         : s => `${ s }% 0%, 100% 0%, 100% 100%, ${ s }% 100%`,
    'top-left'    : s => `0% 0%, ${ 2 * s }% 0%, 0% ${ 2 * s }%`,
    'top-right'   : s => `${ 100 - 2 * s }% 0%, 100% 0%, 100% ${ 2 * s }%`,
    'bottom-left' : s => `0% ${ 100 - 2 * s }%, ${ 2 * s }% 100%, 0% 100%`,
    'bottom-right': s => `100% ${ 100 - 2 * s }%, 100% 100%, ${ 100 - 2 * s }% 100%`,
    diamond       : s => `50% ${ 2 * s - 50 }%, ${ 150 - 2 * s }% 50%, 50% ${ 150 - 2 * s }%, ${ 2 * s - 50 }% 50%`,
}
const clips =
    flatMapArray(
        ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
        clip => [clip + '-1-4', clip + '-1-3', clip + '-1-2', clip + '-2-3', clip + '-3-4']
    )
        .concat(['vertical-1-3', 'vertical-1-2', 'horizontal-1-3', 'horizontal-1-2', 'diamond-1-4', 'diamond-1-3'])
        .map(clip => {
            console.log(clip)
            const [ xxx, type, dividend, divisor ] =
                /(top|bottom|left|right|top-left|top-right|bottom-left|bottom-right|vertical|horizontal|diamond)-(\d)-(\d)/
                    .exec(clip)

            return polys[type](dividend / divisor * 100)
        })

const guitar = {
    layers: makeArray(5, (layer, l) => ({
        strings: makeArray(6, string => ({
            boxes: makeArray(12, i => ({
                color: ['red', 'green', 'blue', 'darkorange', 'purple'][l],
                border: {
                    width: '2px',
                    style: 'solid',
                    color: 'gold',
                    radius: 50,
                },
                clip: randArray(clips),
                /* clip: [
                 *     polys['top-left']    (1 / 3 * 100),
                 *     polys['top-right']   (1 / 3 * 100),
                 *     polys['bottom-left'] (1 / 3 * 100),
                 *     polys['bottom-right'](1 / 3 * 100),
                 *     polys['diamond']     (1 / 3 * 100),
                 * ][l], */
            }))
        }))
    }))
}

ReactDOM.render(
    <Guitar { ...guitar }/>,
    document.getElementById('root'))
registerServiceWorker()
