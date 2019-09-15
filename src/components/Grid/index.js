import React       from 'react'
import { connect } from 'react-redux'
import styles      from './styles.module.scss'
import {
  addIndex,
  reduce,
  find,
} from 'ramda'

const is = (index, current) =>
  addIndex(reduce)(
    (highlight, ind, i) => highlight && (index[i] === ind),
    true,
    current
  )

const highlight = (index, current) => is(index, current) ? '' : null

const getCount = (repeats, current) =>
  ((repeat = find(
      ({ endIndex }) => is(endIndex, current),
      repeats
  )) =>
    repeat && repeat.count
  )()

const Repeat = ({ repeats, current, count }) =>
  count > 1 && (
    <repeat>
      { ((c = getCount(repeats, current)) =>
        c && (<span>({ c })</span>)
      )() }
      <span>{ `x${ count }` }</span>
    </repeat>
  )

export default connect(
  state => state,
)(
  ({ grid: { sections, count }, index: { index = [], repeats } }) => (
    <grid className={ styles.grid }>

      { sections.map(({ name, lines, count }, s) => (
        <section
          key={ s }
          className={ styles.section }
          highlight={ highlight(index, [s]) }
        >
          { name && (
            <name>{ name }</name>
          )}
          <Repeat repeats={ repeats } current={ [s] } count={ count }></Repeat>

        { lines.map((line, l) => (
            <line
              key={ l }
              className={ styles.line }
              highlight={ highlight(index, [s, l]) }
            >

            { line.bars.map(({ repeat, count, items }, b) => (
                <bar
                  key={ b }
                  className={ styles.bar }
                  start={ repeat ? '' : null }
                  end={ count > 1 ? '' : null }
                  highlight={ highlight(index, [s, l, b]) }
                >

                  <chords className={ styles.chords }>
                    { items.map(({ chord, duration }, i) => (
                      <chord
                        className={ styles.chord }
                        style={{ flexGrow: duration }}
                        key={ i }
                        highlight={ highlight(index, [s, l, b, i]) }
                      >
                        <name className={ styles.name }>{ chord }</name>
                        <duration className={ styles.duration } duration={ duration }></duration>
                      </chord>
                    )) }
                  </chords>

                  <Repeat repeats={ repeats } current={ [s, l, b] } count={ count }></Repeat>
                </bar>
              )) }

            </line>
          )) }

        </section>
      )) }

    </grid>
  )
)
