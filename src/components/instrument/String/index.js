import React           from 'react'
import { connect }     from 'react-redux'
import {
  getBoxRange,
} from '../../../store/selectors'
import styles from './styles.module.scss'
import Box    from '../Box'
import {
  applySpec,
  map,
} from 'ramda'

export default connect(
  applySpec({
    range: getBoxRange
  })
)(
  ({ range, string, layer }) => (
    <string className={ styles.string }>
      { map(i => (
        <Box
          key    ={ i      }
          box    ={ i      }
          string ={ string }
          layer  ={ layer  }
        />
      ))(range) }
    </string>
  )
)
