import { TPoint } from "../point"
import { ShapeStyle } from "../styles/shape-style"

export type CubicBezier = {
  style: ShapeStyle
  type: 'cubicbezier'
  a: TPoint
  b: TPoint
  cp1: TPoint
  cp2: TPoint
}