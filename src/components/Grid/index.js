import React       from 'react'
import { connect } from 'react-redux'
import styles      from './styles.module.scss'

const highlight = (index, stack) =>
  stack.reduce(
    (highlight, ind, i) => highlight && (index[i] === ind),
    true
  ) ? '' : null

export default connect(
  state => state,
)(
  ({ grid, index: { index = [0, 0, 0, 0], repeats } }) => (
    <grid className={ styles.grid }>

      { grid.sections.map((section, s) => (
        <section
          key={ s }
          className={ styles.section }
          highlight={ highlight(index, [s]) }
        >

        { section.lines.map((line, l) => (
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

                  <items className={ styles.items }>
                    { items.map(({ chord, duration }, i) => (
                      <item
                        className={ styles.item }
                        style={{ flexGrow: duration }}
                        key={ i }
                        highlight={ highlight(index, [s, l, b, i]) }
                      >
                        <chord className={ styles.chord }>{ chord }</chord>
                        <duration className={ styles.duration } duration={ duration }></duration>
                      </item>
                    )) }
                  </items>

                  <repeat></repeat>
                </bar>
              )) }

            </line>
          )) }

        </section>
      )) }

    </grid>
  )
)
