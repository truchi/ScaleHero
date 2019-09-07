import React  from 'react'
import styles from './styles.module.scss'

export const GUITAR = 'guitar'
export const PIANO  = 'piano'

export default
  ({ type, open, layers }) => (
    <instrument className={ [styles[type], open ? styles.open : ''].join(' ') }>

      { layers.map((strings, key) => (
        <layer className={ styles.layer } key={ key }>

          { strings.map((boxes, key) => (
            <string className={ styles.string } key={ key }>

              { boxes.map(({ clips = [null], style = {} } = {}, key) => (
                <boxes className={ styles.boxes } key={ key }>

                  { clips.map((clipPath, key) => (
                    <box
                      key      ={ key }
                      className={ styles.box }
                      style    ={{ clipPath, ...style }}
                    />
                  )) }

                </boxes>
              )) }

            </string>
          )) }

        </layer>
      )) }

    </instrument>
  )
