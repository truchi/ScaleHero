import React        from 'react'
import { connect }  from 'react-redux'
import {
  getStringRange,
} from '../../../store/selectors'
import styles       from './styles.module.css'
import String       from '../String'
import {
  applySpec,
  map,
} from 'ramda'

export default connect(
  applySpec({
    range: getStringRange
  })
)(
  ({ range, layer }) => (
    <layer className={ styles.layer }>
      { map(i => (
        <String
          key    ={ i     }
          string ={ i     }
          layer  ={ layer }
        />
      ))(range) }
    </layer>
  )
)
