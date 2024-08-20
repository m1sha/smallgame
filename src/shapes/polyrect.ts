import { ShapeStyle } from "../styles/shape-style"
import { TPoint } from "../point"

export type PolyRectangle = {
  style: ShapeStyle
  type: 'polyrectangle'
  topLeft: TPoint
  topRight: TPoint
  bottomLeft: TPoint
  bottomRight: TPoint
}