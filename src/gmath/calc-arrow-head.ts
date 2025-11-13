import { setPoint, TPoint } from "../point"
import { TSegment } from "../segment"

export function calcArrowHead (vector: TSegment, dir: number, arrowRadius: number, arrowAngle: number): TPoint[] {
  const alfa = (vector: TSegment): number => {
    const { x, y } = setPoint(vector.p1.x - vector.p0.x, vector.p1.y - vector.p0.y) //new Point(vector.ep).dec(vector.sp)
    return Math.atan2(y, x)
  }

  const result = []
  const angle = alfa(vector)
  const point = dir < 0 ? vector.p0 : vector.p1
  const r = arrowRadius
  const turn = arrowAngle
  const cos1 = dir * Math.cos(angle - turn)
  const sin1 = dir * Math.sin(angle - turn)
  result.push({ x: point.x - r * cos1, y: point.y - r * sin1 })
  result.push({ x: point.x, y: point.y })
  result.push({ x: point.x, y: point.y })
  const cos2 = dir * Math.cos(angle + turn)
  const sin2 = dir * Math.sin(angle + turn)
  result.push({ x: point.x - r * cos2, y: point.y - r * sin2 })
  return result
}

