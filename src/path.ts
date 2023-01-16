import { Point } from "./point";

let pointDistanceThreshold = 20;


export class Path {
    public points: Array<Point> = []

    public addPoint = (p: Point) => {
        this.points.push(p)
    }

    public smooth() : Path {
        let smoothPath = new Path()
        let lastPoint = this.points[0]
        smoothPath.points.push(lastPoint)

        for (let p of this.points) {
            if (lastPoint.distance(p) > pointDistanceThreshold) {
                smoothPath.points.push(p)
                lastPoint = p
            }
        }
        
        //TODO
        return smoothPath
    }

}