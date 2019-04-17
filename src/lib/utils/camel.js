export default str =>
  str
    .replace(/-(.)/g, $1 => $1.toUpperCase())
    .replace(/-/g, '')
    .replace(/^(.)/, $1 => $1.toLowerCase())
