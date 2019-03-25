import React, { Component } from 'react'

const sanitized = i => ({
    i,
    key: i
})

export default class ActivationList extends Component {
    #components = []
    prev = false

    render() {
        let { Component, length, active, alwaysProps, activeProps, inactiveProps } = this.props

          activeProps =   activeProps || (_ => _)
        inactiveProps = inactiveProps || (_ => _)

        this.#components = Array.from(
            Array(length),
            (v, i) =>
                 React.cloneElement(
                    this.#components[i] || (<Component />),
                    {
                        ...alwaysProps(i, this.prev),
                        ...(i === active ? activeProps : inactiveProps)
                            .call(null, i, this.prev),
                        i,
                        key: i,
                    }
                )
        )

        this.prev = active

        return this.#components
    }
}
