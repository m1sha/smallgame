import { type TPoint } from "../point"

const lerpScalar = (g: number, c: number, dt: number): number => {
  const d = g - c
  if (d > dt) return c + dt
  if (d < -dt) return c - dt
  return g
}

const lerp = (g: TPoint, c: TPoint, dt: number): void => {
  c.x = lerpScalar(g.x, c.x, dt)
  c.y = lerpScalar(g.y, c.y, dt)
}

export { lerp, lerpScalar }