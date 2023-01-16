import { Point } from "./point";


export class LineSegment {
    a: Point
    b: Point

    constructor(a: Point, b: Point) {
        this.a = a
        this.b = b
    }


    intersection(other: LineSegment) : Point | undefined {
        let t = (((this.a.x - other.a.x) * (other.a.y - other.b.y)) - ((this.a.y - other.a.y)*(other.a.x - other.b.x)))/(((this.a.x - this.b.x)*(other.a.y - other.b.y)) - ((this.a.y - this.b.y)*(other.a.x - other.b.x)))
        //let u = ((this.a.x - other.a.x) * (this.a.y - this.b.y) - (this.a.y - other.a.y)*(other.a.x - other.b.x))/((this.a.x - this.b.x)*(other.a.y - other.b.y) - (this.a.y - this.b.y)*(this.a.x - other.b.x))

        if (t > 1 || t < 0) {
            return undefined
        }

        let intersection = this.a.add(this.b.subtract(this.a).times(t))

        return intersection
    }
}