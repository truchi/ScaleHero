//** Logs scoped arguments and own argument and returns own argument
//:: (...args) -> arg -> arg
export default (...args) => arg => console.log(...args, arg) || arg
