import { ShapeStyle } from "../styles/shape-style"
import { TPoint } from "../point"

export type VLine = {
  style: ShapeStyle
  type: 'vline'
  p: TPoint
  height: number
}