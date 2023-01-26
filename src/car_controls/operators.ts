
//these are fuzzy operators

let and = (...args: number[]) => Math.min(...args)
let or = (...args: number[]) => Math.max(...args)


export {and, or}