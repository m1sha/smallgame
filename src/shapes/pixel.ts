import { ShapeStyle } from "../styles/shape-style"

export type Pixel = {
  style: ShapeStyle
  type: 'pixel'
  x: number
  y: number
}