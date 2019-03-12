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
const guitar = (layers = 5, strings = 6, boxes = 12, { border, clips } = {}) => ({
    layers: makeArray(layers, (layer, l) => ({
        key: l,
        duration: '2s',
        clip: clips[l],
        strings: makeArray(strings, (string, s) => ({
            key: s,
            boxes: makeArray(boxes, (box, b) => ({
                key: b,
                styles: {
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

// TODO take border into account!
const loop     = false
const duration = 3000
const radius   = 0
const color    = i => `hsl(${ i * 360000 / duration }, 60%, 60%)`
const border   = { width: '2px', style: 'solid', color: 'white', radius }

const orientations = [
    'north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'
]
const layouts = [
    [
        [1/1, 'rect'    , 'top'        ],
    ], [
        [1/2, 'rect'    , 'topleft'    ],
        [1/2, 'rect'    , 'topright'   ],
        [1/2, 'rect'    , 'bottomleft' ],
        [1/2, 'rect'    , 'bottomright'],
    ], [
        [1/3, 'rect'    , 'top'        ],
        [1/3, 'rect'    , 'horizontal' ],
        [1/3, 'rect'    , 'bottom'     ],
    ], [
        [1/3, 'rect'    , 'left'       ],
        [1/3, 'rect'    , 'vertical'   ],
        [1/3, 'rect'    , 'right'      ],
    ], [
        [1/3, 'rect'    , 'diagasc'    ],
        [1/3, 'triangle', 'topleft'    ],
        [1/3, 'triangle', 'bottomright'],
    ], [
        [1/3, 'rect'    , 'diagdesc'   ],
        [1/3, 'triangle', 'topright'   ],
        [1/3, 'triangle', 'bottomleft' ],
    ], [
        [1/1, 'rect'    , 'diamond'    ],
        [1/4, 'triangle', 'topright'   ],
        [1/4, 'triangle', 'topleft'    ],
        [1/4, 'triangle', 'bottomright'],
        [1/4, 'triangle', 'bottomleft' ],
    ],
]

const getGuitar = clips => guitar(clips.length, 1, 1, { clips, border })
const getState  = (() => {
    var t0 = performance.now();
    const ret =  {
        layouts: layouts.map(layout =>
            orientations.map(orientation =>
                getGuitar(layout.map(clip => get.apply(null, clip.concat(orientation))))
            )
        )
    }
    var t1 = performance.now();
    console.log(`getState internal took ${ t1 - t0 }`);

    return i => ({
        layouts:
            ret.layouts.map(layout =>
                layout.map(guitar => ({
                    ...guitar,
                    layers: guitar.layers.map(layer => ({
                        ...layer,
                        strings: layer.strings.map(string => ({
                            ...string,
                            boxes: string.boxes.map(box => ({
                                ...box,
                                styles: {
                                    ...box.styles,
                                    color: color(i)
                                }
                            }))
                        }))
                    }))
                }))
            )
    })
})()

class App extends Component {
    constructor(props) {
        super(props)

        this.i = -1
        this.state = this.getState()
        console.log('ctor', this.state)
    }

    componentDidMount() {
        if (loop)
            this.intervalID = setInterval(() => this.tick(), duration)
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    getState() {
        var t0 = performance.now();
        const state = getState(this.i)
        var t1 = performance.now();
        console.log(`getState took ${ t1 - t0 }`);

        return state
    }

    tick() {
        this.i = this.i + 1
        this.setState(this.getState())
    }

    render() {
        /* return (<></>) */
        console.log('render', this.state)
        return (
            <>
                { this.state.layouts.map((layout, i) => (
                    <div key={ i }>
                        { layout.map((guitar, i) => (
                            <div key={ i } style={{ display: 'inline-block' }}>
                                <Guitar { ...guitar }></Guitar>
                            </div>
                        )) }
                    </div>
                )) }
            </>
        )
    }
}

export default App
