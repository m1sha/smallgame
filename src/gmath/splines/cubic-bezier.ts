import { Point, TPoint } from "../../point"

export function cubicBezier (a: TPoint, b: TPoint, p1: TPoint, p2: TPoint, t: number) {
  const u = 1 - t
  const tt = t * t
  const uu = u * u
  const uuu = uu * u
  const ttt = tt * t

  return new Point(
    uuu * a.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * b.x, 
    uuu * a.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * b.y
  ) 
}