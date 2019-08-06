import {
  add,
  addIndex,
  adjust,
  append,
  compose as c,
  evolve,
  identity,
  init,
  isNil,
  last,
  merge,
  mergeAll,
  pickBy,
  reduce,
  tail
} from 'ramda'

const r = addIndex(reduce)
const recursiveReduce =
  ({ before = identity, after = identity, getItems = item => item.items } = {}) =>
    ({ acc = {}, item = {}, cursor = [0] } = {}) =>
      after(
        r(
          (acc, item, i) => (
            getItems(item)
              ? recursiveReduce(before, after)
              : (acc, item, cursor) => after(before(acc, item, cursor), item, cursor)
          )(acc, item, append(i, cursor)),
          before(acc, item, cursor),
          getItems(item)
        ),
        item,
        cursor,
      )

export default class Iterator {
  constructor(grid) {
    this._grid = grid.grid

    this._init()
  }

  _init() {
    console.log(this._grid)

    const before = (acc, item, cursor) => {
      return append(
        { cursor, item },
        acc
      )
    }

    const after = (acc, item, cursor) => {
      const count = item.meta && item.meta.count

      if (!count) return acc
      else        return append({ count }, acc)
    }

    this._data = recursiveReduce(before, after)([], this._grid, [0])
    console.log(this._data)
  }

  *[Symbol.iterator]() {

  }

  // _init() {
  //   const r = addIndex(reduce)

  //   const makeMap = (
  //     item,
  //     cursor,
  //     { stack, map, prev } = { stack: [], map: new Map(), prev: null }
  //   ) => {
  //     const starts = item.meta && item.meta.repeat
  //     const ends   = item.meta && item.meta.count

  //     // Append cursor to map
  //     map.set(cursor, { item, next: null, repeat: null })

  //     // Set previous cursor's next cursor (which is current cursor)
  //     if (prev)
  //       map.set(prev, merge(map.get(prev), { next: cursor }))

  //     // Stack the start of repeating sections
  //     if (starts)
  //       stack = append(cursor, stack)

  //     // At the end of a repeating section,
  //     // update the map's cursor with the beginning cursor
  //     if (ends)
  //       map.set(cursor, merge(map.get(cursor), { repeat: stack.pop() }))

  //     // Previous cursor is now current cursor
  //     prev = cursor

  //     return { stack, map, prev }
  //   }

  //   const recursiveReduce =
  //     fn =>
  //       (item, cursor, acc) =>
  //         r(
  //           (acc, item, i) => (item.items ? recursiveReduce(fn) : fn)(item, append(i, cursor), acc),
  //           fn(item, cursor, acc),
  //           item.items || []
  //         )

  //   this._map     = recursiveReduce(makeMap)(this._grid, [0]).map
  //   this._cursors = [...this._map.keys()]
  //   this._root    = this._cursors[0]

  //   console.log(this._grid)
  //   console.log(this._map)
  //   this._debugMap()

  //   return this
  // }

  // *[Symbol.iterator]() {
  //   this._repeats = []

  //   this._debug = false
  //   // yield* this._yieldNode([0])

  //   // console.log('WE ARE DONE!!!!!!')

  //   // has data? -> yield data
  //   // has repeat? -> push repeat
  //   // has children? -> recur children
  //   // has count? repeat from last repeat
  // }

  // *_yieldNode(cursor = [0], depth = 0) {
  //   const log = (...args) =>  this._debug
  //     ? console.log.apply(console, [].concat([`(${ ['grd', 'sct', 'lin', 'bar', 'dat'][depth] })` + ' '.repeat(depth * 4)], args))
  //     : undefined
  //   this._infinite = (this._infinite || 0) + 1
  //   if (this._debug && this._infinite > 100) {
  //     log('BEWARE THE INFINITE!!!')
  //     return
  //   }

  //   const node = this._get(cursor)
  //   log('---', cursor.join(' '), node)
  //   if (!node) {
  //     log('nope')
  //     return
  //   }

  //   const {
  //     meta: { repeat, count } = {},
  //     data,
  //     items
  //   } = node

  //   if (repeat) {
  //     const lastFrom = (last(this._repeats) || { from: [] }).from
  //     if (lastFrom.join('-') !== cursor.join('-'))
  //       this._repeats = append({ from: cursor, reps: 1, depth }, this._repeats)
  //   }
  //   if (data) yield data
  //   if (items) {
  //     log('going to first child')
  //     yield* this._yieldNode(append(0, cursor), depth + 1)
  //   }
  //   if (count) {
  //     const { from, reps, depth: d } = last(this._repeats)
  //     if (reps < count) {
  //       this._repeats = adjust(-1, evolve({ reps: add(1) }), this._repeats)
  //       log('repeat', from.join(' '), reps, count)
  //       yield* this._yieldNode(from, d)
  //     } else {
  //       log('clearing repeats')
  //       this._repeats = init(this._repeats)
  //     }
  //   }

  //   // if (!repeat) {}
  //   log('brother')
  //   yield* this._yieldNode(adjust(-1, add(1), cursor), depth)
  // }

  // _get(cursor) {
  //   return reduce(
  //     (node, i) => node && node.items && node.items[i],
  //     { items: [this._grid] },
  //     cursor
  //   )
  // }

  // *oldGen() {
  //   let next = {
  //     cursor : this._root,
  //     repeats: [],
  //   }

  //   while ((next = this._next(next)).data) {
  //     // debugger

  //     yield next.data
  //   }
  // }

  // _next({ cursor, repeats }) {
  //   let data
  //   let { item, next, repeat } = this._map.get(cursor)

  //   const count = item.meta.count
  //   const reps  = last(repeats) || 0

  //   if (repeat) {
  //     if (reps < count) {
  //       next = repeat

  //     } else {
  //     }
  //   } else {
  //   }

  //   if (item.data) {
  //     return { data: item.data, cursor: next, repeats }
  //   } else if (repeat) {
  //     const count = item.meta.count
  //     const reps  = repeats[repeats.length - 1] || 0

  //     if (reps < count) {
  //       return
  //     } else {
  //       return
  //     }
  //   } else if (next) {
  //     return this._next({ cursor: next, repeats })
  //   } else {
  //     return { data: null }
  //   }
  // }

  // next() {
  //   if (this.done) return { done: true }

  //   const done  = this.done
  //   const value = this._get('data')

  //   this._pushRepeat()
  //   this.done = this._forward()

  //   return { value, done }
  // }

  // goto({ section, line, bar, data }) {
  //   this.cursor = {
  //     section,
  //     line,
  //     bar,
  //     data,
  //     repeats: [],
  //   }

  //   return this
  // }

  // reset() {
  //   return this.goto({
  //     section: 0,
  //     line   : 0,
  //     bar    : 0,
  //     data   : 0,
  //   })
  // }

  // _get(what) {
  //   const sections = this.grid.sections
  //   const section  = sections[this.cursor.section]
  //   const lines    = section.lines
  //   const line     = lines[this.cursor.line]
  //   const bars     = line.bars
  //   const bar      = bars[this.cursor.bar]
  //   const datas    = bar.data
  //   const data     = datas[this.cursor.data]

  //   return {
  //     sections, section,
  //     lines   , line,
  //     bars    , bar,
  //     datas   , data,
  //   }[what]
  // }

  // _forward() {
  //   const hasNext = (what) => this.cursor[what] < this._get(what + 's').length - 1
  //   const inc     = (what) => ((this.cursor[what] += 1, false))
  //   const res     = (what) => ((this.cursor[what]  = 0, true ))

  //   const nextSection = () => hasNext('section') ? inc('section') : true
  //   const nextLine    = () => hasNext('line'   ) ? inc('line'   ) : res('line') && nextSection()
  //   const _nextBar    = () => hasNext('bar'    ) ? inc('bar'    ) : res('bar' ) && nextLine   ()
  //   const nextData    = () => hasNext('data'   ) ? inc('data'   ) : res('data') && nextBar    ()

  //   const nextBar = () => {
  //     let   repeated = false
  //     const bar      = this._get('bar')
  //     const count    = bar.meta.count

  //     if (count) {
  //       const { repeats }         = this.cursor
  //       const { start, count: c } = repeats[repeats.length - 1]

  //       if (c >= count) {
  //         this.cursor.repeats.pop()
  //       } else {
  //         this.cursor.repeats[repeats.length - 1].count += 1
  //         this.cursor = Object.assign({}, this.cursor, start)

  //         repeated = true
  //       }
  //     }

  //     return repeated ? false : _nextBar()
  //   }

  //   return nextData()
  // }

  // _pushRepeat() {
  //   if (!this._get('bar').meta.repeat) return this

  //   const { section, line, bar, repeats } = this.cursor
  //   const last = repeats[repeats.length - 1] || {}

  //   const isRepeating = ({ start }) => start
  //           && section === start.section
  //           && line    === start.line
  //           && bar     === start.bar

  //   if (!isRepeating(last))
  //     this.cursor.repeats
  //     .push({
  //       start: { section, line, bar },
  //       count: 1
  //     })

  //   return this
  // }

  // _debugMap() {
  //   const cursorToString = cursor => {
  //     let   ret     = ''
  //     const grid    = cursor[0]
  //     const section = cursor[1]
  //     const line    = cursor[2]
  //     const bar     = cursor[3]
  //     const data    = cursor[4]

  //     if (grid    !== undefined) ret += `grid: ${ grid }, `
  //     if (section !== undefined) ret += `section: ${ section }, `
  //     if (line    !== undefined) ret += `line: ${ line }, `
  //     if (bar     !== undefined) ret += `bar: ${ bar }, `
  //     if (data    !== undefined) ret += `data: ${ data }, `

  //     return ret
  //   }

  //   const toString = cursor => cursor.join('-')

  //   this._map.forEach(({ next, repeat }, cursor) => {
  //     console.log(`At ${ toString(cursor) }`)
  //     if (next)
  //       console.log(`---> next ${ toString(next) }`)
  //     else
  //       console.log(`---> NO NEXT`)
  //     if (repeat)
  //       console.log(`---> REPEAT ${ toString(repeat) }`)
  //   })
  // }
}
