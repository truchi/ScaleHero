let color = (interval, accidentals) => {
  const h = 360 / 6 * (interval - 2)
  const s = 50 + 10 * accidentals
  const l = 50 + 10 * accidentals

  return `hsl(${h}, ${s}%, ${l}%)`
}

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
  }

  for (let interval of intervals) {
    colors[interval] = {}

    for (let accidental of accidentals) {
      colors[interval][accidental] = color(interval, accidental)
    }
  }

  return colors
}

export default {
  background : 'black'
, colors     : colors()
, width      : '40px'
, height     : '40px'
, radius     : '10px'
, margin     : '4px 8px'
, borderWidth: '4px'
, borderStyle: 'solid'
, highlight  : 'white'
}
