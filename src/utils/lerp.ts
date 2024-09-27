import { TPoint } from "point"

const _lerp = (g: number, c: number, dt: number): number => {
  const d = g - c
  if (d > dt) return c + dt
  if (d < -dt) return c - dt
  return g
}

const lerp = (g: TPoint, c: TPoint, dt: number): void => {
  c.x = _lerp(g.x, c.x, dt)
  c.y = _lerp(g.y, c.y, dt)
}

export { lerp }