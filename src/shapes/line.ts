import { ShapeStyle } from "../styles/shape-style"
import { type TPoint } from "../point"

export type Line = {
  style: ShapeStyle
  type: 'line'
  p0: TPoint
  p1: TPoint
}