import React, { Component } from 'react'
import Guitar from './instruments/guitar/Guitar'
import klasses, { get } from '../lib/polygons'

for (let klass in klasses) {
    window[klass] = klasses[klass]
}

const makeArray = (length = 0, fn = null) => {
    return new Array(length)
        .fill()
        .map((undef, index) => index)
        .map(fn ? fn : i => i)
}
const guitar = (layers = 5, strings = 6, boxes = 12, { color, border, clips } = {}) => ({
    layers: makeArray(layers, (layer, l) => ({
        key: l,
        duration: '1s',
        clip: clips[l],
        strings: makeArray(strings, (string, s) => ({
            key: s,
            boxes: makeArray(boxes, (box, b) => ({
                key: b,
                styles: {
                    color,
                    border: border || {
                        width: '2px',
                        style: 'solid',
                        color: 'gold',
                        radius: 50,
                    },
                }
            }))
        }))
    }))
})

const duration = 1000
const color    = i => ({ color: `hsl(${ i * 36000 / duration }, 60%, 60%)` })
const clips    = [get(1/2, 'topleft', 'southeast'), get(1/2, 'bottomright', 'northwest')]
const border   = { width: '2px', style: 'solid', color: 'white', radius: 50 }
const getState = i => guitar(2, 1, 1, { ...color(i), clips, border })

console.log(clips)

class App extends Component {
    constructor(props) {
        super(props)

        this.i = -1
        this.state = { guitar: getState(this.i) }
    }

    componentDidMount() {
        this.intervalID = setInterval(() => this.tick(), duration)
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    tick() {
        this.i = this.i + 1
        this.setState({ guitar: getState(this.i) })
    }

    render() {
        return <Guitar { ...this.state.guitar }></Guitar>
    }
}

export default App
