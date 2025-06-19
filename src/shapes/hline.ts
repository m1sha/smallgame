import { ShapeStyle } from "../styles/shape-style"
import { type TPoint } from "../point"

export type HLine = {
  style: ShapeStyle
  type: 'hline'
  p: TPoint
  width: number
}