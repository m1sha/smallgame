import { ShapeStyle } from "../styles/shape-style"
import { type TPoint } from "../point"

export type Polygon = {
  style: ShapeStyle
  type: 'polygon'
  points: TPoint[]
}