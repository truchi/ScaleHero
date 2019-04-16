import React, {
  useRef,
} from 'react'
import { connect } from 'react-redux'
import {
  getFrom,
  getLayer,
  getNote,
} from '../../../store/selectors'
import { Scale } from '../../../lib/music'
import { Mask  } from '../../../lib/instrument'
import styles    from './styles.module.scss'
import BoxUnit   from '../BoxUnit'

export default connect(
  (state, props) => {
    const from = getFrom(state)
    const note = getNote(state, props)
    const {
      MAX,
      layerMasks: masks,
      palette,
      root,
      scale,
    } = getLayer(state, props)

    return {
      MAX,
      masks,
      from,
      root,
      note,
      scale,
      palette,
    }
  }
)(
  ({ MAX, masks, from, root, note, scale, palette, box, string, layer, index }) => {
    const units = useRef(Array(MAX).fill({})).current

    units[index] = {
      style: Mask.insideAny(string)(from + box)(masks)
        ? palette[Scale.getInterval(root)(note)(scale)] || null
        : null
    }

    return (
      <box className={ styles.box }>
        <svg className={ styles.svg }>
          { units.map(({ style }, unit) => (
            <BoxUnit
              key   ={ unit   }
              unit  ={ unit   }
              box   ={ box    }
              string={ string }
              layer ={ layer  }
              style ={ style  }
            />
          )) }
        </svg>
      </box>
    )
  }
)
