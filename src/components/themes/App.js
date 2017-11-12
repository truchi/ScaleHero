let colors = (
  intervals   = ['2', '3', '4', '5', '6', '7']
, accidentals = ['-2', '-1', '0', '1']
) => {
  let colors = {
    '0': {
      '0': '#222'
    }
  , '1': {
      '0': 'white'
    }
  , 'C': {
      '0': 'white'
    }
  }

  let notes = [null, null, 'D', 'E', 'F', 'G', 'A', 'B']

  for (let interval of intervals) {
    let note = notes[interval]
    colors[interval] = {}
    colors[note    ] = {}

    for (let accidental of accidentals) {
      const h = 360 / 6 * (interval - 2)
      const s = 50 + 10 * accidental
      const l = 50 + 10 * accidental

      let color = `hsl(${h}, ${s}%, ${l}%)`
      colors[interval][accidental] = color
      colors[note    ][accidental] = color

    }
  }

  return colors
}

export default {
  background : 'black'
, colors     : colors()
}
