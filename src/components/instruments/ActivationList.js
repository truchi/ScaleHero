import React, { Component } from 'react'

const sanitized = i => ({
    i,
    key: i
})

export default class ActivationList extends Component {
    #components = []
    prev = false

    constructor(props) {
        super(props)
    }

    get components() {
        const prevLength = this.#components.length
        const {
            Component,
            active        = this.prev,
            length        = prevLength,
            initialProps  = _ => _,
            alwaysProps   = _ => _,
            activeProps   = _ => _,
            inactiveProps = _ => _
        } = this.props


        this.#components = this.#components
            // Remove extra
            .slice(0, length)
            // Add new
            .concat(
                prevLength >= length
                    ? []
                    : Array.from(
                        Array(length - prevLength),
                        (v, i) =>
                            React.cloneElement(
                                (<Component />),
                                initialProps(i)
                            )
                    )
            )
            // Apply new active
            .map((component, i) =>
                React.cloneElement(
                    component,
                    {
                        ...alwaysProps(i, this.prev),
                        ...(i === active
                          ? activeProps
                          : inactiveProps
                        ).call(null, i, this.prev),
                        i,
                        key: i,
                    }
                )
            )

        return this.#components
    }

    render() {
        const { active = this.prev } = this.props
        const components = this.components
        this.prev        = active

        return components
    }
}
