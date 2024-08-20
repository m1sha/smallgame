import { ShapeStyle } from "../styles/shape-style"

export type RoundedRectangle = {
  style: ShapeStyle
  type: 'roundedrectangle'
  x: number
  y: number
  width: number
  height: number
  topLeft: number
  topRight: number
  bottomLeft: number
  bottomRight: number
}