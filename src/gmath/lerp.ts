import { Point, type TPoint } from "../point"

export function lerpScalar (a: number, b: number, t: number) {
  return a * (1 - t) + b * t
}

export function lerp (a: TPoint, b: TPoint, t: number): TPoint {
  return new Point(lerpScalar(a.x, b.x, t), lerpScalar(a.y, b.y, t))
}

export function lerpAccum (a: TPoint, b: TPoint, t: number): Point {
  a.x = lerpScalar(a.x, b.x, t)
  a.y = lerpScalar(a.y, b.y, t)
  return a instanceof Point ? a : Point.from(a)
}

export function lerpUnclampedScalar (a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function lerpUnclamped (a: TPoint, b: TPoint, t: number) {
  return new Point(lerpUnclampedScalar(a.x, b.x, t), lerpUnclampedScalar(a.y, b.y, t))
}

export function lerpUnclampedAccum (a: TPoint, b: TPoint, t: number): void {
  a.x = lerpUnclampedScalar(a.x, b.x, t)
  a.y = lerpUnclampedScalar(a.y, b.y, t)
}

export function lerpAngle (current: number, target: number, t: number): number {
  const twoPi = Math.PI * 2
  let difference = (target - current) % twoPi
  
  if (difference < -Math.PI) {
    difference += twoPi
  } else if (difference > Math.PI) {
    difference -= twoPi
  }
  
  return current + difference * t
}

