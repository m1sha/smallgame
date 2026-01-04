import { TPoint } from "../../../point"

export function gaussianSmooth (points: TPoint[], sigma: number): TPoint[] {
  const N = points.length
  const res: TPoint[] = []
  for (let i = 0; i < N; i++) {
    let wSum = 0, xSum = 0, ySum = 0
    for (let j = 0; j < N; j++) {
        const d = Math.abs(i - j)
        const w = Math.exp(-(d * d) / (2 * sigma * sigma))
        wSum += w
        xSum += points[j].x * w
        ySum += points[j].y * w
    }
    res.push({ x: xSum / wSum, y: ySum / wSum })
  }
  return res
}