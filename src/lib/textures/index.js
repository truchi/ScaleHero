import textures from 'textures'

const xmlns = 'http://www.w3.org/2000/svg'

class DOM {
  constructor(tag = '', attrs = {}, children = []) {
    this.tag      = tag
    this.attrs    = attrs
    this.children = children
  }

  append(tag) {
    const child = new DOM(tag)
    this.children.push(child)

    return child
  }

  attr(key, value) {
    this.attrs[key] = value

    return this
  }

  map(fn) {
    return fn(this.tag, this.attrs, this.children.map(child => child.map(fn)))
  }

  toString() {
    return this.map(
      (tag, attrs, children) => {
        attrs = Object.entries(attrs)
          .map(([name, value]) => `${ name }="${ value }"`)
          .join(' ')
        attrs    = attrs ? ' ' + attrs : ''
        children = children.join('')

        return `<${ tag }${ attrs }>${ children }</${ tag }>`
      }
    )
  }

  static textures(id, type, props) {
    let d = new DOM()

    Object.entries(props).reduce(
      (t, [name, value]) =>
        t[name] && typeof t[name] === 'function'
          ? t[name](value)
          : t,
      textures[type]()
    )(d)

    d = d.children[0]

    if (id != null)
      d.children[0].attrs.id = id

    return d
  }
}

export default ({ id, type, opacity = 1, ...props }) => {
  const texture = DOM
    .textures(id, type, props)
    .children[0]

  const width   = texture.attrs.width
  const height  = texture.attrs.height
  const viewBox = `0 0 ${ width } ${ height }`

  return new DOM(
    'svg',
    { width, height, viewBox, xmlns, opacity },
    texture.children
  )
}
