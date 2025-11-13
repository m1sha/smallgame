import { type TPoint } from "../point"

const moveTowardsScalar = (g: number, c: number, dt: number): number => {
  const d = g - c
  if (d > dt) return c + dt
  if (d < -dt) return c - dt
  return g
}

const moveTowards = (goal: TPoint, current: TPoint, dt: number): TPoint => {
  return current
}

const moveTowardsAccum = (goal: TPoint, current: TPoint, dt: number): TPoint => {
  current.x = moveTowardsScalar(goal.x, current.x, dt)
  current.y = moveTowardsScalar(goal.y, current.y, dt)
  return current
}

const moveTowardsAngle = (target: number, current: number,  maxDelta: number): number => {
  let delta = ((target - current + 180) % 360) - 180;

  if (delta > maxDelta) {
    delta = maxDelta;
  } else if (delta < -maxDelta) {
    delta = -maxDelta;
  }

  let result = current + delta;
  if (result >= 360) {
    result -= 360;
  }
  return result;
}

export { moveTowards, moveTowardsScalar, moveTowardsAccum, moveTowardsAngle }