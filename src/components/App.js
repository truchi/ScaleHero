import React, { Component } from 'react'
import Guitar from './instruments/guitar/Guitar'

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
        Object.keys(polys),
        clip => ['1-4', '1-3', '1-2', '2-3', '3-4'].map(s => clip + '-' + s)
    )
        .map(clip => {
            const [ xxx, type, dividend, divisor ] =
                new RegExp(`(${ Object.keys(polys).join('|') })-(\\d)-(\\d)`)
                    .exec(clip)

            return polys[type](dividend / divisor * 100)
        })

const guitar = (layers = 5, strings = 6, boxes = 12, { color, clip } = {}) => ({
    layers: makeArray(layers, (layer, l) => ({
        key: l,
        strings: makeArray(strings, (string, s) => ({
            key: s,
            boxes: makeArray(boxes, (box, b) => ({
                key: b,
                color: (() => {
                    if (!color) return 'red'
                    if (color === 'random') return randArray(['red', 'green', 'blue', 'darkorange', 'purple'])

                    return typeof color === 'function'
                         ? color(l, s, b)
                         : color
                })(),
                border: {
                    width: '2px',
                    style: 'solid',
                    color: 'gold',
                    radius: 50,
                },
                clip: (() => {
                    if (!clip) return null
                    if (clip === 'random') return randArray(clips)

                    return typeof clip === 'function'
                        ? clip(l, s, b)
                        : clip
                })()
            }))
        }))
    }))
})

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            guitar: guitar(2, 6, 12, { color: 'red', clip: polys['top'](1 / 2 * 100) })
        }
    }

    componentDidMount() {
        this.intervalID = setTimeout(
            () => this.tick(),
            2000
        )
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    tick() {
        this.setState({
            guitar: guitar(2, 6, 12, { color: 'blue', clip: polys['top'](1 / 2 * 100) })
        })
    }

    render() {
        console.log(this.state.guitar)
        return <Guitar { ...this.state.guitar }></Guitar>
    }
}

export default App
