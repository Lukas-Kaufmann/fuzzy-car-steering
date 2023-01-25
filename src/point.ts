

export class Point {
    public x: number
    public y: number

    constructor (x: number, y: number) {
        this.x = x
        this.y = y
    }

    public distance = (other: Point)=> Math.sqrt(Math.pow((this.x - other.x), 2) + Math.pow((this.y - other.y), 2))

    directionTo = (other: Point) => {
        let x = other.x - this.x
        let y = other.y - this.y
        
        return Math.atan2(y, x)
    }

    times(scalar: number): Point {
        return new Point(this.x * scalar, this.y * scalar)
    }

    add(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y)
    }

    subtract(other:Point):Point {
        return new Point(this.x - other.x, this.y - other.y)
    }

    toArray = () => [this.x, this.y]
}