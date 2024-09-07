import { ShapeStyle } from "../styles/shape-style"
import { TPoint } from "../point"

export type Polygon = {
  style: ShapeStyle
  type: 'polygon'
  points: TPoint[]
}