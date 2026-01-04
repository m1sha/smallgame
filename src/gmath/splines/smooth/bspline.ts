import { TPoint } from "../../../point"

export function bspline (points: TPoint[], samples: number, degree = 3): TPoint[] {
  const n = points.length
  const k = degree + 1
  const knot: number[] = []
  for (let i = 0; i < n + k; i++) knot.push(i)
  const res: TPoint[] = []
  for (let s = 0; s <= samples; s++) {
    const u = (s / samples) * (knot[n + k - 1] - knot[0]) + knot[0]
    let span = k - 1;
    for (let i = k; i < n + k; i++) if (u >= knot[i]) span = i
    const d: TPoint[] = points.slice(span - k, span)
    for (let r = 1; r <= k; r++) {
      for (let i = k - 1; i >= r; i--) {
        const alpha = (u - knot[span - k + i]) /
            (knot[span + 1 + i - r] - knot[span - k + i])
        d[i] = {
            x: (1 - alpha) * d[i - 1].x + alpha * d[i].x,
            y: (1 - alpha) * d[i - 1].y + alpha * d[i].y,
        }
      }
    }
    res.push(d[k - 1])
  }
  return res
}