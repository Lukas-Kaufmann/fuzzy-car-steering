import { getSteeringAndAcceleration } from "./car_controls/controls";
import { LineSegment } from "./line";
import { Path } from "./path";
import { Point } from "./point";

//car constants
let STEERING_CONSTANT = 0.005
let ACCELERATION_CONSTANT = 0.001
let MAX_SPEED = 3
let MIN_SPEED = -2 //this is a negative value because it is the maxium reverse speed


//sensor constants
let SENSOR_ANGLES_DG = [-30, 0, 30]
let MAX_DISTANCE = 200
let NUM_SENSORS = 3

function radians(degrees: number) {
    return degrees * Math.PI / 180
}

export class Car {
    //car variables
    public position: Point
    direction: number
    speed: number = 1

    //sensor variables
    borderDistances: [number, number, number] = [MAX_DISTANCE, MAX_DISTANCE, MAX_DISTANCE]

    update = (destination: Point, borders: Path[]) => {        

        let sensorLines = SENSOR_ANGLES_DG
            .map(dg => radians(dg))
            .map(angle => {
                let finalAngle = angle + this.direction
                let dX = Math.cos(finalAngle)
                let dY = Math.sin(finalAngle)
                
                let relativeEndpoint = new Point(dX, dY).times(MAX_DISTANCE)
                let endpoint = this.position.add(relativeEndpoint)
                return new LineSegment(this.position, endpoint)
            })

        let borderLines: LineSegment[] = []
        for (let border of borders) {
            for (let i = 1; i < border.points.length; i+=1) {
                borderLines.push(new LineSegment(border.points[i-1], border.points[i]))
            }
        }

        let distances = sensorLines.map(sensor => {
            let allDistances = borderLines.map(border => sensor.intersection(border))
            .filter(intersection => intersection !== undefined)
            .map(intersection => this.position.distance(intersection))

            return Math.min(...allDistances, MAX_DISTANCE)
        })//map to smallest distance
        this.borderDistances = [distances[0], distances[1], distances[2]]

        let [steering, acceleration] = getSteeringAndAcceleration(this.speed, ...this.borderDistances, this.position.distance(destination), this.position.directionTo(destination) - this.direction)

        this.speed += acceleration * ACCELERATION_CONSTANT

        this.speed = Math.min(MAX_SPEED, this.speed)
        this.speed = Math.max(MIN_SPEED, this.speed)

        this.direction += steering * STEERING_CONSTANT * this.speed

        let dX = Math.cos(this.direction) * this.speed
        let dY = Math.sin(this.direction) * this.speed

        //then update position
        this.position = new Point(this.position.x + dX, this.position.y + dY)

    }

    draw = (context: CanvasRenderingContext2D) => {
        context.save()

        context.translate(this.position.x, this.position.y)

        context.rotate(this.direction)
        //context.scale(1.5, 1.5)

        //body of car
        context.fillStyle = "red"
        context.fillRect(-12, -8, 24, 16)

        //windshield
        context.fillStyle = "white"
        context.fillRect(2, -5, 6, 10)

        //wheels
        context.fillStyle = "black"
        context.fillRect(6, -9, 5, 3)
        context.fillRect(-9, -9, 5, 3)
        context.fillRect(6, 6, 5, 3)
        context.fillRect(-9, 6, 5, 3)

        context.restore()
    }

    drawSensorLines = (context: CanvasRenderingContext2D) => {
        context.save()

        context.translate(this.position.x, this.position.y)

        context.rotate(this.direction)


        for (let i = 0; i < NUM_SENSORS; i+=1) {
            
            let angle = radians(SENSOR_ANGLES_DG[i])
            let distance = this.borderDistances[i]

            context.save()

            context.rotate(angle)

            context.fillStyle = "black"

            context.fillRect(12, 0, distance, 1)

            context.restore()
            
        }

        context.restore()
    }
}