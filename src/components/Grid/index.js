import React       from 'react'
import { connect } from 'react-redux'
import styles      from './styles.module.scss'

export default connect(
  state => state,
)(
  ({ grid, index: { index, repeats } }) => (
    <grid className={ styles.grid }>

      { grid.sections.map((section, key) => (
        <section className={ styles.section } key={ key }>

          { section.lines.map((line, key) => (
            <line className={ styles.line } key={ key }>

              { line.bars.map(({ repeat, count, items }, key) => (
                <bar className={ styles.bar } key={ key } start={ repeat ? '' : null } end={ count > 1 ? '' : null }>

                  <items className={ styles.items }>
                    { items.map(({ chord, duration }, key) => (
                      <item className={ styles.item } style={{ flexGrow: duration }} key={ key }>
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
