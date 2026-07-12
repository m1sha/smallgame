import { ShapeStyle } from "../styles/shape-style"

export type Pie = {
  style: ShapeStyle
  type: 'pie'
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
  counterclockwise: boolean
}

