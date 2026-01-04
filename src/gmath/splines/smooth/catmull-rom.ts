import { TPoint } from "../../../point"

export function catmullRom (
    points: TPoint[],
    samplesPerSegment: number = 20,
    tension = 0
): TPoint[] {
  const n = points.length
  const res: TPoint[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n]
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    const p3 = points[(i + 2) % n]
      for (let j = 0; j <= samplesPerSegment; j++) {
        const t = j / samplesPerSegment
        const t2 = t * t
        const t3 = t2 * t
        const a0 = -tension * t3 + 2 * tension * t2 - tension * t
        const a1 = (2 - tension) * t3 + (tension - 3) * t2 + 1
        const a2 = (tension - 2) * t3 + (3 - 2 * tension) * t2 + tension * t
        const a3 = tension * t3 - tension * t2
        const x = a0 * p0.x + a1 * p1.x + a2 * p2.x + a3 * p3.x
        const y = a0 * p0.y + a1 * p1.y + a2 * p2.y + a3 * p3.y
        res.push({ x, y })
      }
  }
  return res
}