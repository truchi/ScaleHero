import React     from 'react'
import textures  from 'textures'
import { camel } from '../utils'

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

  toJSX() {
    return this.map(
      (tag, attrs, children) => {
        const the = { tag }
        attrs = Object.fromEntries(
          Object.entries(attrs)
          .map(([name, value]) => [camel(name), value])
        )

        return (
          <the.tag { ...attrs }>
            { children.map((child, key) =>
              React.cloneElement(child, { key }))
            }
          </the.tag>
        )
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

    if (id)
      d.children[0].attrs.id = id

    return d
  }
}

window.DOM = DOM

export default ({ id, type, ...props }) =>
  DOM
    .textures(id, type, props)
    .toJSX()
