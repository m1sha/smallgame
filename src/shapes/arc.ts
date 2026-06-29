import { ShapeStyle } from "../styles/shape-style"

export type Arc = {
  style: ShapeStyle
  type: 'arc'
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
  counterclockwise: boolean
}

