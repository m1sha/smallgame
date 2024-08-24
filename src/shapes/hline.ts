import { ShapeStyle } from "../styles/shape-style"
import { TPoint } from "../point"

export type HLine = {
  style: ShapeStyle
  type: 'hline'
  p: TPoint
  width: number
}