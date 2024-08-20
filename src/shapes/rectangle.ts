import { ShapeStyle } from "../styles/shape-style"

export type Rectangle = {
  style: ShapeStyle
  type: 'rectangle'
  x: number
  y: number
  width: number
  height: number
}