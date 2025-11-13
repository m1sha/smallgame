import { Point, TPoint } from "../point"

export function smoothDampScalar (current: number, target: number, currentVelocity: { value: number }, smoothTime: number, deltaTime: number, maxSpeed = Infinity) {
  smoothTime = Math.max(0.0001, smoothTime)
  let omega = 2 / smoothTime

  let x = omega * deltaTime
  let exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
  
  let change = current - target
  let originalTo = target
  
  
  let maxChange = maxSpeed * smoothTime
  change = Math.min(Math.max(change, -maxChange), maxChange)
  
  target = current - change
  
  let temp = (currentVelocity.value + omega * change) * deltaTime
  currentVelocity.value = (currentVelocity.value - omega * temp) * exp
  
  let output = target + (change + temp) * exp
  
  
  if ((originalTo - current > 0) === (output > originalTo)) {
    output = originalTo
    currentVelocity.value = (output - originalTo) / deltaTime
  }
  
  return output
}

export function smoothDamp (current: TPoint, target: TPoint, currentVelocity: { x: { value: number }, y: { value: number } }, smoothTime: number, deltaTime: number, maxSpeed = Infinity) {
  return new Point(
    smoothDampScalar(current.x, target.x, currentVelocity.x, smoothTime, deltaTime, maxSpeed),
    smoothDampScalar(current.y, target.y, currentVelocity.y, smoothTime, deltaTime, maxSpeed)
  )
}