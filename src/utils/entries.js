export const fromEntries = entries => {
  let o = {}
  for(let entry of entries)
    o[entry[0]] = entry[1]

  return o
}

export default (o, fn = _ => _) => fromEntries(
  fn(
    Array.isArray(o) ? o : Object.entries(o)
  )
)
