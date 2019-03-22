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
            /* style.stroke = { width: '10px', color: 'gold' } */
            style.radius = 100
        }

        if (+interval === 1) style.color = 'white'

        return new Style(style)
    })
}

const scales = Object.fromEntries(
    Object.entries({
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
    }
].map(mask => new InstrumentMask(mask))

const lesson = new Lesson({
    instrument: instruments.guitarStandard,
    layers: [
        { boxMask: boxMasks.brTriangle, palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [{ position: 5, mask: instrumentMasks[0] }] },
        { boxMask: boxMasks.diag      , palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [] },
        { boxMask: boxMasks.tlTriangle, palette: palettes.cool, scale: scales.chromatic, instrumentMasks: [] },
    ],
    timeline: [
        [
            { root: 'C' },
            { root: 'G' },
            { root: 'F' },
        ],
        [
            { root: 'G', instrumentMasks: [{}, { position: 4, mask: instrumentMasks[0] }] },
            { root: 'F' },
            { root: 'C' },
        ],
        [
            { root: 'F' },
            { root: 'C' },
            { root: 'G' },
        ],
        [
            { root: 'C', instrumentMasks: [{ position: 0 }, null] },
            { root: 'G' },
            { root: 'F' },
        ],
    ].map(layers => layers.map(({ root, instrumentMasks }) => ({ instrumentMasks, root: new Note({ name: root }) })))
})

Object.entries(
    { palettes, scales, instruments, boxMasks, instrumentMasks, lesson }
).forEach(([name, object]) => console.log(name, object))
/* const findNoteName = note => Object.entries(Note.VALUES).find(([name, int]) => note === int)[0]
 * const makePalette  = (root, scale, palette) => {
 *     root = Note.VALUES[root]
 *     const scaleValues = scale.map(note => (root + Interval.VALUES[note]) % Note.N)
 * 
 *     return Object.fromEntries(
 *         Object.entries(Note.VALUES).map(([note, value]) => {
 *             const i     = scaleValues.findIndex(v => v === value)
 *             let   style = i >= 0 ? palette[scale[i]] : {}
 * 
 *             style        = { ...defaultStyle       , ...style        }
 *             style.stroke = { ...defaultStyle.stroke, ...style.stroke }
 * 
 *             return [note, style]
 *         })
 *     )
 * }
 * 
 * const makeStrings = (instrument, length) =>
 *     instrument.map(instrumentNote => {
 *         const boxes    = []
 *         instrumentNote = Note.VALUES[instrumentNote]
 * 
 *         for(let i = 0; i < length; ++i)
 *             boxes.push({
 *                 name: findNoteName((instrumentNote + i) % Note.N)
 *             })
 * 
 *         return { boxes }
 *     })
 * 
 * const makeStates = (lesson) => {
 *     return lesson.timeline.map(layers => {
 *         return {
 *             layers: layers.map((layer, i) => {
 *                 layer = {
 *                     ...layer,
 *                     ...lesson.layers[i]
 *                 }
 *                 return {
 *                     palette: makePalette(layer.root, layer.scale, layer.palette),
 *                     strings: makeStrings(lesson.instrument, lesson.length),
 *                     ...get(layer.mask.size, layer.mask.type, layer.mask.shape, layer.transition),
 *                     duration: '1s'
 *                 }
 *             })
 *         }
 *     })
 * }
 * 
 * const states = makeStates(lesson)
 * console.log(states) */

const duration = 2000

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
        return
        const state = this.getState()
        console.log('next state', state)

        if (state)
            this.timer = setTimeout(() => this.setState(state), duration)
    }

    getState() {
        /* if (this.i >= states.length) return false

         * return states[this.i++] */
    }

    render() {
        return (<div></div>)
        return (
            <Guitar { ...this.state }></Guitar>
        )
    }
}

export default App
