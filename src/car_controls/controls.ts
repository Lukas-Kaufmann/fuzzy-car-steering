import { triangleFuzzySet, trapeziodalFuzzySet, leftOpenFuzzySet, rightOpenFuzzySet } from "./membership_functions"
import { and } from "./operators"

//distance sets
let farAway = rightOpenFuzzySet(150, 200)
let close = leftOpenFuzzySet(100, 150)
let veryClose = leftOpenFuzzySet(20, 40)

//speed sets
let reverse = leftOpenFuzzySet(-1, 0)
let forward = rightOpenFuzzySet(0, 1)

let forwardFast = rightOpenFuzzySet(2, 3)
let forwardSlowly = triangleFuzzySet(0, 1, 3)


let speedUp_acc = 20
let brakeHard_acc = -150
let brake_acc = -20
let reverse_acc = brake_acc

let steerStraight = 0
let turnLeft = -2
let turnLeftHard = -5
let turnRight = 2
let turnRightHard = 5

let farLeft = leftOpenFuzzySet(10, 0)
let farRight = rightOpenFuzzySet(0, 10)

let left = leftOpenFuzzySet(100, 0)
let right = rightOpenFuzzySet(0, 100)


enum Output {
  ACCELERATION,
  STEERING
}

function centerOfGravity(arr: number[][]) : number {
  let nomenator = 0
  let divisor = 0
  for (let i = 0; i < arr.length; i+=1) {
    nomenator += arr[i][0] * arr[i][1]
    divisor += arr[i][0]
  }
  return (nomenator / divisor) || 0
}


export function getSteeringAndAcceleration(speed: number, leftDistance: number, frontDistance: number, rightDistance: number, goalDistance: number, directiontoGoal: number): [number, number] /*steering, acceleration */ {
  //TODO proper fuzzy way of calculating the crisp output
  let individualAccelerations: number[][] = []
  let individualSteerings: number[][] = []
  
  function addToResult(membershipValue: number, parameter: Output, outputValue: number) {
    if (parameter == Output.ACCELERATION) {
      individualAccelerations.push([membershipValue, outputValue])
    }
    if (parameter == Output.STEERING) {
      individualSteerings.push([membershipValue, outputValue])
    }
  }

  //rules
  //syntax for the rules is a bit of a mess, couldnt figure out how to make it into a nice sentence like
  // If speed is forward and front distance is close then acceleration is brake
  addToResult(close(frontDistance), Output.ACCELERATION, brake_acc)
  addToResult(and(veryClose(frontDistance), forwardFast(speed)), Output.ACCELERATION, brakeHard_acc)
  addToResult(farAway(frontDistance), Output.ACCELERATION, speedUp_acc)
  addToResult(veryClose(frontDistance), Output.ACCELERATION, brakeHard_acc)

  addToResult(and(close(leftDistance), farAway(rightDistance)), Output.STEERING, turnRight)
  addToResult(and(close(rightDistance), farAway(leftDistance)), Output.STEERING, turnLeft)

  addToResult(and(farAway(goalDistance), left(directiontoGoal)), Output.STEERING, turnLeft)
  addToResult(and(farAway(goalDistance), right(directiontoGoal)), Output.STEERING, turnRight)

  //apply rules (first define rules)

  //TODO way to get results

  //defuzzify
  return [centerOfGravity(individualSteerings), centerOfGravity(individualAccelerations)]
}