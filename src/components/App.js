import React, { Component } from 'react'
import Guitar from './instruments/guitar/Guitar'

const makeArray = (length = 0, fn = null) => {
    return new Array(length)
        .fill()
        .map((undef, index) => index)
        .map(fn ? fn : i => i)
}
const guitar = (layers = 5, strings = 6, boxes = 12, { color, clip } = {}) => ({
    layers: makeArray(layers, (layer, l) => ({
        key: l,
        strings: makeArray(strings, (string, s) => ({
            key: s,
            boxes: makeArray(boxes, (box, b) => ({
                key: b,
                color,
                border: {
                    width: '2px',
                    style: 'solid',
                    color: 'gold',
                    radius: 50,
                },
                clip,
            }))
        }))
    }))
})

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            guitar: guitar(2, 6, 12, { color: 'red', clip: 'top-1-2' })
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
            guitar: guitar(2, 6, 12, { color: 'blue', clip: 'top-1-2' })
        })
    }

    render() {
        console.log(this.state.guitar)
        return <Guitar { ...this.state.guitar }></Guitar>
    }
}

export default App
