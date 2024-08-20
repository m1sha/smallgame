import { ShapeStyle } from "../styles/shape-style"

export type Circle = {
  style: ShapeStyle
  type: 'circle'
  x: number
  y: number
  radius: number
}