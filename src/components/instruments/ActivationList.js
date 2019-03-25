import React, { Component } from 'react'

const sanitized = (fn = _ => _, i) => ({
    i,
    key: i,
    ...fn(i)
})

export default class ActivationList extends Component {
    #components = []
    prev = false

    constructor(props) {
        super(props)

        const { length, Component, initialProps } = this.props

        for(let i = 0; i < length; ++i) {
            this.#components.push(React.cloneElement((<Component />), sanitized(initialProps, i)))
        }
    }

    render() {
        let { active, activeProps, inactiveProps } = this.props

          activeProps =   activeProps || (_ => _)
        inactiveProps = inactiveProps || (_ => _)

        this.#components = this.#components.map(
            component =>
                React.cloneElement(
                    component,
                    (component.props.i === active ? activeProps : inactiveProps)
                        .call(null, component.props.i, this.prev)
                )
        )

        this.prev = active

        return this.#components
    }
}
