import React, { Component } from 'react'
import Guitar from './instruments/guitar/Guitar'
import { get } from '../lib/polygons/index'
import entries from '../utils/entries'

const notes = {
    C: 0, 'C#': 1,
    D: 2, 'D#': 3,
    E: 4,
    F: 5, 'F#': 6,
    G: 7, 'G#': 8,
    A: 9, 'A#': 10,
    B: 11
}
const N = Object.keys(notes).length
const intervals = {
    '1'  : 0,
    'b2' : 1, '2' : 2, '#2': 3,
    'b3' : 3, '3' : 4,
    'b4' : 4, '4' : 5, '#4': 6,
    'b5' : 6, '5' : 7, '#5': 8,
    'b6' : 8, '6' : 9,
    'bb7': 9, 'b7': 10, '7': 11
}

const defaultStyle = {
    color : 'transparent',
    radius: null,
    stroke: {
        width: null,
        color: 'transparent'
    }
}
const palettes = {
    blue: entries(Object.keys(intervals).map(interval => [interval, { color: 'blue' }])),
    red : entries(Object.keys(intervals).map(interval => [interval, { color: 'red' }])),
    cool: entries(
        Object.keys(intervals).map(interval => {
            const color = (a, i) => `hsl(${ a * 360 / 7 }, ${ 50 + i }%, ${ 50 + i }%)`
            const last  = +interval[interval.length - 1]
            const style = {
                radius: 50
            }

            if (interval.startsWith('bb')) {
                style.color = color(last, -30)
            } else if (interval.startsWith('b')) {
                style.color = color(last, -20)
            } else if (interval.startsWith('#')) {
                style.color = color(last, 20)
            } else {
                style.color = color(last, 0)
            }

            if (['1', 'b3', '3', 'b5', '5', 'bb7', 'b7', '7'].includes(interval)) {
                style.stroke = {
                    width: '10px',
                    color: 'gold'
                }
            }

            if (+interval === 1) {
                style.color = 'white'
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
    chromatic: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
}

const masks = {
    fullRect  : { size: 1  , type: 'rect'    , shape: 'top'     },
    tlTriangle: { size: 1/2, type: 'triangle', shape: 'topleft' },
}

const instruments = {
    guitarStandard: ['E', 'A', 'D', 'G', 'B', 'E'].reverse()
}

const lesson = {
    instrument: instruments.guitarStandard,
    length: 12,
    layers: [
        { mask: masks.fullRect  , transition: 'north' },
        { mask: masks.tlTriangle, transition: 'north' },
    ],
    timeline: [
        [
            { root: 'C', scale: scales.pentam , palette: palettes.cool },
            { root: 'C', scale: scales.aeolian, palette: palettes.cool },
        ],
        [
            { root: 'C', scale: scales.pentaM , palette: palettes.cool },
            { root: 'C', scale: scales.ionian , palette: palettes.cool },
        ],
        [
            { root: 'C', scale: scales.ionian , palette: palettes.cool },
            { root: 'F', scale: scales.ionian , palette: palettes.cool },
        ],
        [
            { root: 'C', scale: scales.pentam , palette: palettes.cool },
            { root: 'F', scale: scales.ionian , palette: palettes.cool },
        ],
    ]
}

const findNoteName = note => Object.entries(notes).find(([name, int]) => note === int)[0]
const makePalette  = (root, scale, palette) => {
    root = notes[root]
    const scaleValues = scale.map(note => (root + intervals[note]) % N)

    return entries(notes, entries => entries.map(([note, value]) => {
        const i     = scaleValues.findIndex(v => v === value)
        let   style = i >= 0 ? palette[scale[i]] : {}

        style        = { ...defaultStyle       , ...style        }
        style.stroke = { ...defaultStyle.stroke, ...style.stroke }

        return [note, style]
    }))
}

const makeStrings = (instrument, length) =>
    instrument.map(instrumentNote => {
        const boxes    = []
        instrumentNote = notes[instrumentNote]

        for(let i = 0; i < length; ++i)
            boxes.push({
                name: findNoteName((instrumentNote + i) % N)
            })

        return { boxes }
    })

const makeStates = (lesson) => {
    return lesson.timeline.map(layers => {
        return {
            layers: layers.map((layer, i) => {
                layer = {
                    ...layer,
                    ...lesson.layers[i]
                }
                return {
                    palette: makePalette(layer.root, layer.scale, layer.palette),
                    strings: makeStrings(lesson.instrument, lesson.length),
                    ...get(layer.mask.size, layer.mask.type, layer.mask.shape, layer.transition),
                    duration: '1s'
                }
            })
        }
    })
}

const states = makeStates(lesson)

console.log(palettes, scales, instruments, lesson)
console.log(states)

const duration = 3000

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
            <Guitar { ...this.state }></Guitar>
        )
    }
}

export default App
