import { ShapeStyle } from "../styles/shape-style"
import { TVector } from "../vector"

export type Vectors = {
  style: ShapeStyle
  type: 'vectors'
  vectors: TVector[]
  arrowRadius: number
  arrowAngle: number
}
