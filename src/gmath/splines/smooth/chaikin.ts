import { TPoint } from "../../../point"

export function chaikin (points: TPoint[], k = 1, alpha = 0.25): TPoint[] {
  let res = [...points]
  for (let it = 0; it < k; it++) {
    const next: TPoint[] = []
    for (let i = 0; i < res.length - 1; i++) {
      const p = res[i]
      const q = res[i + 1]
      next.push({ x: (1 - alpha) * p.x + alpha * q.x,
                  y: (1 - alpha) * p.y + alpha * q.y })
      next.push({ x: alpha * p.x + (1 - alpha) * q.x,
                  y: alpha * p.y + (1 - alpha) * q.y })
    }
    if (res[0] !== res[res.length - 1]) {
      next.push(...next.slice(0, 2))
    }
    res = next
  }
  return res
}