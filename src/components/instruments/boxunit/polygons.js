const polys = {
    top           : s => `0% 0%, 100% 0%, 100% ${ s }%, 0% ${ s }%`,
    horizontal    : s => `0% ${ 50 - s / 2 }%, 0% ${ 50 + s / 2 }%, 100% ${ 50 + s / 2 }%, 100% ${ 50 - s / 2 }%`,
    bottom        : s => `0% ${ s }%, 100% ${ s }%, 100% 100%, 0% 100%`,
    left          : s => `0% 0%, ${ s }% 0%, ${ s }% 100%, 0% 100%`,
    vertical      : s => `${ 50 - s / 2 }% 0%, ${ 50 + s / 2 }% 0%, ${ 50 + s / 2 }% 100%, ${ 50 - s / 2 }% 100%`,
    right         : s => `${ s }% 0%, 100% 0%, 100% 100%, ${ s }% 100%`,
    'top-left'    : s => `0% 0%, ${ 2 * s }% 0%, 0% ${ 2 * s }%`,
    'top-right'   : s => `${ 100 - 2 * s }% 0%, 100% 0%, 100% ${ 2 * s }%`,
    'bottom-left' : s => `0% ${ 100 - 2 * s }%, ${ 2 * s }% 100%, 0% 100%`,
    'bottom-right': s => `100% ${ 100 - 2 * s }%, 100% 100%, ${ 100 - 2 * s }% 100%`,
    diamond       : s => `50% ${ 2 * s - 50 }%, ${ 150 - 2 * s }% 50%, 50% ${ 150 - 2 * s }%, ${ 2 * s - 50 }% 50%`,
}

const get = string => {
    try {
        const [ xxx, type, dividend, divisor ] =
            new RegExp(`(${ Object.keys(polys).join('|') })-(\\d)-(\\d)`)
                .exec(string)

        return polys[type](dividend / divisor * 100)
    } catch (e) {
        return null
    }
}

export { get }
