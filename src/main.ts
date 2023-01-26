import './style.css';
import { Path } from './path';
import { Point } from './point';
import { Car } from './car';

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
let width = window.innerWidth;
let height = window.innerHeight;

let path : Path
let borders: Array<Path> = []
let car : Car | undefined = undefined



function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);


    if (car) {
        car.update(path, borders)
    }

    //draw path
    if (path.points.length > 1) {
        ctx.beginPath()
        for (let i = 0; i < path.points.length; i+=1) {
            let p = path.points[i]
            ctx.lineTo(p.x, p.y)
        }
        ctx.strokeStyle = "blue"
        ctx.lineWidth = 2
        ctx.stroke()
    }

    //draw borders
    for (let border of borders) {
        if (border.points.length > 1) {
            ctx.beginPath()
            for (let i = 0; i < border.points.length; i+=1) {
                let p = border.points[i]
                ctx.lineTo(p.x, p.y)
            }
            ctx.strokeStyle = "brown"
            ctx.lineWidth = 5
            ctx.stroke()
        }   
    }

    if (car) {
        car.draw(ctx)

        if (drawSensorLines) {
            car.drawSensorLines(ctx)
        }
    }
}

let isPathDrawing = false
let pathDrawingEnabled = true

let isPlacingStart = true

let isPlacingDestination = false


let borderDrawingEnabled = false
let isBorderDrawing = false

let drawSensorLines = true //TODO change to false



function setupControls() {
    let controlsContainer = document.createElement("div")


    let placeStartControl = document.createElement("input")
    placeStartControl.type = "checkbox"
    placeStartControl.checked = true
    placeStartControl.onchange = () => {
        isPlacingStart = !isPlacingStart    
    }
    let startLabel = document.createElement("label")
    startLabel.textContent = "Place start"

    controlsContainer.appendChild(placeStartControl)
    controlsContainer.appendChild(startLabel)

    
    let placeDestinationControl = document.createElement("input")
    placeDestinationControl.type = "checkbox"
    placeDestinationControl.checked = false
    placeDestinationControl.onchange = () => {
        isPlacingDestination = !isPlacingDestination
    }
    let destinationLabel = document.createElement("label")
    destinationLabel.textContent = "Place destination"

    controlsContainer.appendChild(placeDestinationControl)
    controlsContainer.appendChild(destinationLabel)


    let drawPathControl = document.createElement("input")
    drawPathControl.textContent = "Draw Path"
    drawPathControl.type = "checkbox"
    drawPathControl.checked = true

    drawPathControl.onchange = () => {
        pathDrawingEnabled = !pathDrawingEnabled
    }
    let pathLabel = document.createElement("label")
    pathLabel.textContent = "Draw Path"

    controlsContainer.appendChild(drawPathControl)
    controlsContainer.appendChild(pathLabel)

    let borderDrawControl = document.createElement("input")
    borderDrawControl.type = "checkbox"
    borderDrawControl.onchange = () => {
        borderDrawingEnabled = !borderDrawingEnabled
    }
    let borderLabel = document.createElement("label")
    borderLabel.textContent = "Draw Borders"

    controlsContainer.appendChild(borderDrawControl)
    controlsContainer.appendChild(borderLabel)

    let resetButton = document.createElement("button")
    resetButton.textContent = "Reset"
    resetButton.onclick = () => {
        path = new Path()
        borders = []
        car = undefined
    }
    controlsContainer.appendChild(resetButton)

    let spawnCar = document.createElement("button")
    spawnCar.textContent = "Spawn Car"
    spawnCar.onclick = () => {
        
        if (path.points.length > 1) {
            car = new Car()
            car.position = path.points[0]

            car.direction = car.position.directionTo(path.points[1])
        }
    }

    controlsContainer.appendChild(spawnCar)

    let sensorLines = document.createElement("input")
    sensorLines.type = "checkbox"
    //TODO remove
    sensorLines.checked = true
    
    sensorLines.onclick = () => {
        drawSensorLines = !drawSensorLines
    }

    let sensorLabel = document.createElement("label")
    sensorLabel.textContent = "Draw Sensor Lines"
    
    controlsContainer.appendChild(sensorLines)
    controlsContainer.appendChild(sensorLabel)
    
    

    document.body.appendChild(controlsContainer)

}

window.onload = () => {
    setupControls()

    let container = document.createElement('div');
    container.id = "container";
    canvas = document.createElement('canvas');
    canvas.id = "game";
    canvas.width = width;
    canvas.height = height - 10;
    canvas.classList.add('red_border');
    container.appendChild(canvas);
    document.body.appendChild(container);
    ctx = canvas.getContext("2d");
    path = new Path()

    canvas.onmousedown = (e) => {
        if (pathDrawingEnabled) {
            isPathDrawing = true
            path = new Path()
        }

        if (borderDrawingEnabled) {
            isBorderDrawing = true
            borders.push(new Path())
        }
        
        let canvasX = e.clientX - canvas.offsetLeft
        let canvasY =  e.clientY - canvas.offsetTop
    }

    canvas.onmouseup = (e) => {
        isPathDrawing = false
        path = path.smooth()

        if (borderDrawingEnabled) {
            isBorderDrawing = false
            let index = borders.length - 1
            borders[index] = borders[index].smooth()
        }
    }

    canvas.onmousemove = (e) => {
        let canvasX = e.clientX - canvas.offsetLeft
        let canvasY =  e.clientY - canvas.offsetTop
        if (isPathDrawing) {
            
            
            path.addPoint(new Point(canvasX, canvasY))
        }
        if (isBorderDrawing) {
            borders[borders.length-1].addPoint(new Point(canvasX, canvasY))
        }
    }

    gameLoop();
}
