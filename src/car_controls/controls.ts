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


let left = leftOpenFuzzySet(-1, 0)
let straight = triangleFuzzySet(-0.5, 0, 0.5)
let right = rightOpenFuzzySet(0, 1)



//outputs
let speedUp_acc = 20
let brakeHard_acc = -150
let brake_acc = -20
let reverse_acc = brake_acc

let steerStraight = 0
let turnLeft = -3
let turnRight = 3



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

  let individualAccelerations: number[][] = []
  let individualSteerings: number[][] = []


  function addToSteering(membershipValue: number, outputValue: number) {
    individualSteerings.push([membershipValue, outputValue])
  }

  function addToAcceleration(membershipValue: number, outputValue: number) {
    individualAccelerations.push([membershipValue, outputValue])
  }

  //rules
  //syntax for the rules is a bit of a mess, couldnt figure out how to make it into a nice sentence like
  // If speed is forward and front distance is close then acceleration is brake
  addToAcceleration(close(frontDistance), brake_acc)
  addToAcceleration(and(veryClose(frontDistance), forwardFast(speed)), brakeHard_acc)
  addToAcceleration(and(farAway(frontDistance), farAway(goalDistance)), speedUp_acc)
  addToAcceleration(veryClose(frontDistance), brakeHard_acc)

  //addToAcceleration(reverse(speed), speedUp_acc)//this rule is simply to stop the car going forth and back

  addToSteering(and(close(leftDistance), farAway(rightDistance)), turnRight)
  addToSteering(and(close(rightDistance), farAway(leftDistance)), turnLeft)

  addToSteering(and(farAway(goalDistance), left(directiontoGoal), farAway(leftDistance)), turnLeft)
  addToSteering(and(farAway(goalDistance), right(directiontoGoal), farAway(rightDistance)), turnRight)

  addToSteering(and(straight(directiontoGoal), farAway(frontDistance)), steerStraight)
  

  addToAcceleration(and(close(goalDistance), forward(speed)), brake_acc)
  addToAcceleration(and(close(goalDistance), forwardFast(speed)), brakeHard_acc)
  addToAcceleration(and(veryClose(goalDistance), forwardFast(speed)), brakeHard_acc)

  //defuzzify
  return [centerOfGravity(individualSteerings), centerOfGravity(individualAccelerations)]
}