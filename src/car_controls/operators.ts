
//these are fuzzy operators

let and = (a: number, b: number) => Math.min(a, b)
let or = (a: number, b: number) => Math.max(a, b)


export {and, or}