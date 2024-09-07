import { ShapeStyle } from "../styles/shape-style"
import { TPoint } from "../point"

export type Polydots = {
  style: ShapeStyle
  type: 'polydots'
  points: TPoint[]
  radius: number
}