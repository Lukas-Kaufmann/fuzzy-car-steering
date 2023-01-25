
//architecture

// below functions (to create a fuzzy set return a function - the membership function)
// membership function takes a crisp value and returns a value 0 to 1
// the fuzzy sets are distinguished by their variable names

type Membership = (crisp: number) => number



function triangleFuzzySet(left: number, center: number, right: number): Membership {
    return function(crisp: number) {
        if (crisp <= left || crisp >= right) {
            return 0
        }
        if (crisp <= center) {
            //left slope
            let k = 1 / (center - left)
            let deltaCrisp = crisp - left
            return k * deltaCrisp
        }
        //right slope
        let k = 1 / (right - center)
        let deltaCrisp = (crisp - center)
        return  1 - (k * deltaCrisp)
    }
}

function trapeziodalFuzzySet(left: number, topLeft: number, topRight: number, right: number): Membership {
    return function(crisp: number) {
        if (crisp >= topLeft && crisp <= topRight) {
            return 1
        }
        if (crisp <= left || crisp >= right) {
            return 0
        }
        if (crisp <= topLeft) {
            //left slope
            let k = 1/(topLeft - left)
            let deltaCrisp = crisp - left
            return k * deltaCrisp
        }
        if (crisp >= topRight) {
            //right slope
            let k = 1 / (right - topRight)
            let deltaCrisp = crisp - topRight
            return 1 - (k * deltaCrisp)
        }
    }
}

function leftOpenFuzzySet(topRight: number, right: number): Membership {
    let k = 1 / (right - topRight)
    return function(crisp: number) {
        if (crisp >= right) {
            return 0
        }
        if (crisp <= topRight) {
            return 1
        }
        let deltaCrisp = crisp - topRight

        return 1 - (k * deltaCrisp)
    }
}

function rightOpenFuzzySet(left: number, topLeft: number) : Membership {
    let k = 1 / (topLeft - left)
    return function(crisp: number) {
        if (crisp >= topLeft) {
            return 1
        }
        if (crisp <= left) {
            return 0
        }
        let deltaCrisp = crisp - left
        return k * deltaCrisp
    }
}
//TODO trapeziodal and triangular classes

export {triangleFuzzySet, trapeziodalFuzzySet, leftOpenFuzzySet, rightOpenFuzzySet}