import { Point } from "./point";
var segmentIntersect = require('line-segment-intersect-2d')

export class LineSegment {
    a: Point
    b: Point

    constructor(a: Point, b: Point) {
        this.a = a
        this.b = b
    }


    intersection(other: LineSegment) : Point | undefined {
        let pointArray : number[] | null = segmentIntersect([], this.a.toArray(), this.b.toArray(), other.a.toArray(), other.b.toArray())
        if (pointArray) {
            return new Point(pointArray[0], pointArray[1])
        }
        return undefined
    }
}