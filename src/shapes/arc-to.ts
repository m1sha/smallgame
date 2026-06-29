import { TPoint } from "../point"
import { ShapeStyle } from "../styles/shape-style"

export type ArcTo = {
  style: ShapeStyle
  type: 'arc-to'
  p0: TPoint
  p1: TPoint
  p2: TPoint
  radius: number
}