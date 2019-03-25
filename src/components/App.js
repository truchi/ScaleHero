import React, { Component } from 'react'
import Guitar from './instruments/guitar/Guitar'
import { Mask as BoxMask } from '../lib/polygons'
import { Note, Interval, Scale } from '../lib/music'
import { Instrument, Mask as InstrumentMask } from '../lib/instruments'
import Style from '../classes/Style'
import Palette from '../classes/Palette'
import Lesson from '../classes/Lesson'

Object.entries(
    { BoxMask, Note, Interval, Scale, Instrument, InstrumentMask, Style, Palette, Lesson }
).forEach(([name, klass]) => window[name] = klass)

const palettes = {
    blue: new Palette(new Style({ color: 'blue' })),
    red : new Palette(new Style({ color: 'red' })),
    cool: new Palette(interval => {
        interval = interval.name
        const color = (a, i) => `hsl(${ a * 360 / 7 }, ${ 50 + i }%, ${ 50 + i }%)`
        const last  = +interval[interval.length - 1]
        const style = {}

        if      (interval.startsWith('bb')) style.color = color(last, -30)
        else if (interval.startsWith('b') ) style.color = color(last, -20)
        else if (interval.startsWith('#') ) style.color = color(last,  20)
        else                                style.color = color(last,  0)

        if (['1', 'b3', '3', 'b5', '5', 'bb7', 'b7', '7'].includes(interval)) {
            style.stroke = { width: '5px', color: 'gold' }
            style.radius = 50
        }

        if (+interval === 1) style.color = 'white'

        return new Style(style)
    })
}

const scales = Object.fromEntries(
    Object.entries({
        empty    : [],
        pentam   : ['1', 'b3', '4', '5', 'b7'],
        aeolian  : ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
        pentaM   : ['1', '2', '3', '5', '6'],
        ionian   : ['1', '2', '3', '4', '5', '6', '7'],
        chromatic: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
    }).map(([name, intervals]) => [name, new Scale({ intervals: intervals.map(name => new Interval({ name })) })])
)

const boxMasks = Object.fromEntries(
    Object.entries({
        fullRect  : { size: 1  , type: 'rect'    , subtype: 'top'        , transition: 'southeast' },
        tlTriangle: { size: 1/3, type: 'triangle', subtype: 'topleft'    , transition: 'southeast' },
        brTriangle: { size: 1/3, type: 'triangle', subtype: 'bottomright', transition: 'southeast' },
        diag      : { size: 1/3, type: 'rect'    , subtype: 'diagasc'    , transition: 'southeast' },
    }).map(([name, data]) => [name, new BoxMask(data)])
)

const instruments = Object.fromEntries(
    Object.entries({
        guitarStandard: ['E', 'A', 'D', 'G', 'B', 'E']
    }).map(([name, tuning]) => [name, new Instrument({ tuning: tuning.reverse().map(name => new Note({ name })) })])
)

const instrumentMasks = [
    {
        definition: position => [
            [[-Infinity, position], [position + 4, Infinity]],
            [[-Infinity, position], [position + 4, Infinity]],
            [[-Infinity, position], [position + 4, Infinity]],
            [[-Infinity, position], [position + 4, Infinity]],
            [[-Infinity, position], [position + 4, Infinity]],
            [[-Infinity, position], [position + 4, Infinity]],
        ]
    },
    {
        definition: position => [
            [[-Infinity, Infinity]],
            [[-Infinity, Infinity]],
            [[-Infinity, Infinity]],
            [[-Infinity, Infinity]],
            [[-Infinity, Infinity]],
            [[-Infinity, Infinity]],
        ]
    },
].map(mask => new InstrumentMask(mask))

const m = ({ position: 5, mask: instrumentMasks[1] })
const lesson = new Lesson({
    instrument: instruments.guitarStandard,
    duration: '1s',
    timeline: [
        [
            { root: 'C', boxMask: boxMasks.brTriangle, palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] },
            /* { root: 'G', boxMask: boxMasks.diag      , palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] },
             * { root: 'F', boxMask: boxMasks.tlTriangle, palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] }, */
        ],
        [
            { root: 'G', boxMask: boxMasks.brTriangle, palette: palettes.cool, scale: scales.empty, instrumentMasks: [m] },
            /* { root: 'F', boxMask: boxMasks.diag      , palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] },
             * { root: 'C', boxMask: boxMasks.tlTriangle, palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] }, */
        ],
        [
            { root: 'F', boxMask: boxMasks.brTriangle, palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] },
            /* { root: 'C', boxMask: boxMasks.diag      , palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] },
             * { root: 'G', boxMask: boxMasks.tlTriangle, palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] }, */
        ],
        [
            { root: 'C', boxMask: boxMasks.brTriangle, palette: palettes.cool, scale: scales.empty, instrumentMasks: [m] },
            /* { root: 'G', boxMask: boxMasks.diag      , palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] },
             * { root: 'F', boxMask: boxMasks.tlTriangle, palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [m] }, */
        ],
    ].map(layers => layers.map(layer => ({ ...layer, root: new Note({ name: layer.root }) })))
})

window.lesson = lesson
Object.entries(
    { palettes, scales, instruments, boxMasks, instrumentMasks, lesson }
).forEach(([name, object]) => console.log(name, object))

const duration = 2000

class App extends Component {
    constructor(props) {
        super(props)

        this.iterator = lesson.iterator()
        this.state    = this.getState()
    }

    componentDidMount   () { this.update() }
    componentDidUpdate  () { this.update() }
    componentWillUnmount() { clearTimeout(this.timer) }

    update() {
        const state = this.getState()

        if (state)
            this.timer = setTimeout(() => this.setState(state), duration)
    }

    getState() {
        const next = this.iterator.next()

        return next.done ? null : next.value
    }

    render() {
        console.log('state', this.state)
        return (
            <Guitar layers={ this.state.layers }></Guitar>
        )
    }
}

export default App
