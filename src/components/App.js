import React, { Component } from 'react'
import Guitar from './instruments/guitar/Guitar'

const makeArray = (length = 0, fn = null) => {
    return new Array(length)
        .fill()
        .map((undef, index) => index)
        .map(fn ? fn : i => i)
}
const guitar = (layers = 5, strings = 6, boxes = 12, { color, border, clip } = {}) => ({
    layers: makeArray(layers, (layer, l) => ({
        key: l,
        duration: '1s',
        clip,
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

const duration = 100
const color    = i => ({ color: `hsl(${ i * 360 / duration }, 60%, 60%)` })
const clip     = 'horizontal-1-2-north'
const border   = { width: '2px', style: 'solid', color: 'white', radius: 50 }
const getState = i => guitar(1, 1, 1, { ...color(i), clip, border })

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
