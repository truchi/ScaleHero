import React, {
  useRef,
} from 'react'
import { connect }  from 'react-redux'
import {
  getLayer,
  getStringRange,
} from '../../../store/selectors'
import styles from './styles.module.scss'
import BoxMask from '../BoxMask'
import String from '../String'
import {
  map,
  mathMod,
} from 'ramda'

export default connect(
  (state, props) => {
    const {
      MAX,
      boxMask: mask,
    } = getLayer(state, props)

    return {
      MAX,
      mask,
      range: getStringRange(state),
    }
  }
)(
  ({ MAX, mask, range, layer }) => {
    const indexRef   = useRef(-1)
    const prev       = indexRef.current
    indexRef.current = mathMod(indexRef.current + 1, MAX)
    const index      = indexRef.current

    const units = Array(MAX).fill('')
    units[index] = 'enter'
    if (prev !== -1) units[prev] = 'leave'

    return (
      <layer className={ styles.layer }>
        <svg className={ styles.svg }>
          <defs>
            { units.map((animate, unit) => (
              <BoxMask
                key    ={ unit    }
                unit   ={ unit    }
                layer  ={ layer   }
                mask   ={ mask    }
                animate={ animate }
              />
            )) }
          </defs>
        </svg>
        { map(i => (
          <String
            key   ={ i     }
            string={ i     }
            layer ={ layer }
            index ={ index }
          />
        ))(range) }
      </layer>
    )
  }
)
