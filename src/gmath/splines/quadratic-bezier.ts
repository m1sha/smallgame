import { Point, TPoint } from "../../point"

export function quadraticBezier (a: TPoint, b: TPoint, p1: TPoint, t: number) {
  const u = 1 - t;
  return new Point(
    u * u * a.x + 2 * u * t * p1.x + t * t * b.x,
    u * u * a.y + 2 * u * t * p1.y + t * t * b.y
  )
}