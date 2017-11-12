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
      const h = 360 / 6 * (interval - 2)
      const s = 50 + 10 * accidental
      const l = 50 + 10 * accidental

      colors[interval][accidental] = `hsl(${h}, ${s}%, ${l}%)`
    }
  }

  return colors
}

export default {
  background : 'black'
, colors     : colors()
}
