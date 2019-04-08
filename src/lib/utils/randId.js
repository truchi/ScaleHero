//** Returns a random id of length length
//:: Number length -> () -> String id
export default l => () => Math.random().toString(36).substr(2, l)
