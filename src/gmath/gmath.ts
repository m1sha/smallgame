import { Point, type TPoint } from "../point"
import { lerpScalar, lerp, lerpAccum, lerpUnclamped, lerpUnclampedScalar, lerpUnclampedAccum, lerpAngle } from "./lerp"
import { moveTowardsScalar, moveTowards, moveTowardsAccum, moveTowardsAngle } from "./move-towards"
import { smoothDamp, smoothDampScalar } from "./smooth-damp"
import { step } from "./step"
import { smoothstep } from "./smooth-step"
import { getLogZoom } from "./log-zoom"
import { TRect } from "../rect"

type VecType = number | TPoint
type ReturnType<T> = T extends number ? number : T extends TPoint ? Point : never;

const GMath = {
  lerp: <T extends VecType>(a: T, b: T, t: number): ReturnType<T> => {
    if (typeof a === 'number' && typeof b === 'number' ) return lerpScalar(a, b, t) as ReturnType<T>
    return lerp(a as TPoint, b as TPoint, t) as ReturnType<T>
  },

  lerpAccum: (current: TPoint, goal: TPoint, t: number) => lerpAccum(current, goal, t),

  lerpUnclamped: <T extends VecType>(a: T, b: T, t: number): ReturnType<T> => {
    if (typeof a === 'number' && typeof b === 'number' ) return lerpUnclampedScalar(a, b, t) as ReturnType<T>
    return lerpUnclamped(a as TPoint, b as TPoint, t) as ReturnType<T>
  },

  lerpUnclampedAccum: (current: TPoint, goal: TPoint, t: number) => lerpUnclampedAccum(current, goal, t),

  lerpAngle: (current: number, target: number, t: number) => lerpAngle(current, target, t),

  moveTowards: <T extends VecType>(goal: T, current: T, dt: number): ReturnType<T> => {
    if (typeof goal === 'number' && typeof current === 'number' ) return moveTowardsScalar(goal, current, dt) as ReturnType<T>
    return moveTowards(goal as TPoint, current as TPoint, dt) as ReturnType<T>
  },

  moveTowardsAccum: (goal: TPoint, current: TPoint, dt: number) => moveTowardsAccum(goal, current, dt),

  moveTowardsAngle: (target: number, current: number, dt: number) => moveTowardsAngle(target, current, dt),

  smoothDamp: <T extends VecType>(current: T, target: T, currentVelocity: { value: number } | { x: { value: number }, y: { value: number } }, smoothTime: number, deltaTime: number, maxSpeed = Infinity): ReturnType<T> => {
    if (typeof current === 'number' && typeof target === 'number' ) return smoothDampScalar(current, target, currentVelocity as { value: number }, smoothTime, deltaTime, maxSpeed) as ReturnType<T>
    return smoothDamp(current as TPoint, target as TPoint, currentVelocity as { x: { value: number }, y: { value: number } }, smoothTime, deltaTime, maxSpeed) as ReturnType<T>
  },

  step: (edge: number, x: number) => step(edge, x),
  
  smoothstep: (edge0: number, edge1: number, x: number) => smoothstep(edge0, edge1, x),

  logZoom: (step: number, steps: number, minZoom: number, maxZoom: number) => getLogZoom(step, steps, minZoom, maxZoom),

  max: (numbers: number[]) => Math.max.apply(null, numbers),
  min: (numbers: number[]) => Math.min.apply(null, numbers),
  maxX: (r: (TPoint | TRect | { rect: TRect })[]) => max<any>(r, p => typeof p.rect === 'object' ?  p.rect.x : p.x),
  maxY: (r: (TPoint | TRect | { rect: TRect })[]) => max<any>(r, p => typeof p.rect === 'object' ?  p.rect.y : p.y),
  maxHeight: (r: (TRect | { rect: TRect })[]) => max<any>(r, p => typeof p.rect === 'object' ?  p.rect.height : p.height),
  maxWidth: (r: (TRect | { rect: TRect })[]) => max<any>(r, p => typeof p.rect === 'object' ?  p.rect.width : p.width),
  minX: (r: (TPoint | TRect | { rect: TRect })[]) => min<any>(r, p => typeof p.rect === 'object' ?  p.rect.x : p.x),
  minY: (r: (TPoint | TRect | { rect: TRect })[]) => min<any>(r, p => typeof p.rect === 'object' ?  p.rect.y : p.y),
  minHeight: (r: (TRect | { rect: TRect })[]) => min<any>(r, p => typeof p.rect === 'object' ?  p.rect.height : p.height),
  minWidth: (r: (TRect | { rect: TRect })[]) => min<any>(r, p => typeof p.rect === 'object' ?  p.rect.width : p.width)
}

export { GMath }

function max<T> (items: T[], pred: (item: T)=> number) {
  return Math.max.apply(null, items.map(p => pred(p)))
}

function min<T> (items: T[], pred: (item: T)=> number) {
  return Math.max.apply(null, items.map(p => pred(p)))
}