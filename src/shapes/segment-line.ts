import { TPoint } from "../point"
import { ShapeStyle } from "../styles/shape-style"

export type SegmentLine = {
  style: ShapeStyle
  type: 'segmentline'
  startPoint: TPoint
  points: TPoint[]
  addSegment: (point: TPoint) => void
}