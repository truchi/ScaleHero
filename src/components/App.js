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

const styles = [
    { },
    { color: 'hsl(  0, 60%, 60%)' },
    { color: 'hsl( 36, 60%, 60%)' },
    { color: 'hsl( 72, 60%, 60%)' },
    { color: 'hsl(108, 60%, 60%)' },
    { color: 'hsl(144, 60%, 60%)' },
    { color: 'hsl(180, 60%, 60%)' },
    { color: 'hsl(216, 60%, 60%)' },
    { color: 'hsl(252, 60%, 60%)' },
    { color: 'hsl(288, 60%, 60%)' },
    { color: 'hsl(324, 60%, 60%)' },
]
const clip     = 'horizontal-1-2-north'
const border   = { width: '2px', style: 'solid', color: 'white', radius: 50 }
const duration = 100

class App extends Component {
    constructor(props) {
        super(props)

        this.i = -1
        this.state = {
            guitar: guitar(1, 1, 1, { ...styles[styles.length - 1], clip, border })
        }
    }

    componentDidMount() {
        this.intervalID = setInterval(() => this.tick(), duration)
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    tick() {
        this.i = (this.i + 1) % styles.length
        this.setState({
            guitar: guitar(1, 1, 1, { ...styles[this.i], clip, border })
        })
    }

    render() {
        console.log(this.state.guitar)
        return <Guitar { ...this.state.guitar }></Guitar>
    }
}

export default App
