import React, { Component } from 'react'
import Guitar from './instruments/guitar/Guitar'
import { get } from '../lib/polygons/index'
import entries from '../utils/entries'

const intervals = [
    '1',
    'b2', '2', '#2',
    'b3', '3',
    'b4', '4', '#4',
    'b5', '5', '#5',
    'b6', '6',
    'bb7', 'b7', '7'
]

const palettes = {
    cool: entries(
        intervals.map(interval => {
            const color = (a, i) => `hsl(${ a * 360 / 7 }, ${ 50 + i }%, ${ 50 + i }%)`
            const last  = +interval[interval.length - 1]
            const style = {}

            if (interval.startsWith('bb')) {
                style.color = color(last, -20)
            } else if (interval.startsWith('b')) {
                style.color = color(last, -10)
            } else if (interval.startsWith('#')) {
                style.color = color(last, 10)
            } else {
                style.color = color(last, 0)
            }

            if ([1, 3, 5, 7].includes(+interval)) {
                style.border = '1px solid gold'
            }

            return [interval, style]
        })
    )
}

const scales = {
    pentam: ['1', 'b3', '4', '5', 'b7'],
    aeolian: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    pentaM: ['1', '2', '3', '5', '6'],
    ionian: ['1', '2', '3', '4', '5', '6', '7'],
}

const masks = {
    fullRect  : { size: 1  , type: 'rect'    , shape: 'top'     },
    tlTriangle: { size: 1/2, type: 'triangle', shape: 'topleft' },
}

const instruments = {
    guitarStandard: ['E', 'A', 'D', 'G', 'B', 'E'].reverse()
}

const lesson = {
    instrument: 'guitarStandard',
    layers: [
        { mask: 'fullRect'  , transition: 'north' },
        { mask: 'tlTriangle', transition: 'north' },
    ],
    timeline: [
        [
            { root: 'C', scale: 'pentam' , palette: 'cool' },
            { root: 'C', scale: 'aeolian', palette: 'cool' },
        ],
        [
            { root: 'C', scale: 'pentaM' , palette: 'cool' },
            { root: 'C', scale: 'ionian' , palette: 'cool' },
        ],
        [
            { root: 'F', scale: 'pentaM' , palette: 'cool' },
            { root: 'F', scale: 'ionian' , palette: 'cool' },
        ],
    ]
}

const makeStates = (lesson) => {
    return lesson.timeline.map(layers => {
        return {
            layers: layers.map((layer, i) => {
                layer = {
                    ...layer,
                    ...lesson.layers[i]
                }
                const paletteName = layer.palette
                const palette = {
                    [paletteName]:
                    entries(palettes[paletteName], entries => entries
                        .filter(([interval, style]) => layer.scale.includes(interval))
                    )
                }

                return {
                    palette,
                    ...get(layer.mask.size, layer.mask.type, layer.mask.shape, layer.transition)
                }
            })
        }
    })
}

const states = makeStates(lesson)

console.log(palettes, scales, instruments, lesson)
console.log(states)

const duration = 1000

class App extends Component {
    constructor(props) {
        super(props)

        this.i = 0
        this.state = this.getState()
        console.log('initial state', this.state)
    }

    componentDidMount   () { this.update() }
    componentDidUpdate  () { this.update() }
    componentWillUnmount() { clearTimeout(this.timer) }

    update() {
        const state = this.getState()
        console.log('next state', state)

        if (state)
            this.timer = setTimeout(() => this.setState(state), duration)
    }

    getState() {
        if (this.i >= states.length) return false

        return states[this.i++]
    }

    render() {
        return (
            <>
                <Guitar { ...this.state }></Guitar>
            </>
        )
    }
}

export default App
