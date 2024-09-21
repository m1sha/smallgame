import { ShapeStyle } from "../styles/shape-style"
import { TSegment } from "../segment"

export class Arrows {
  style: ShapeStyle
  type: 'arrows' = 'arrows'
  segments: TSegment[]
  arrowRadius: number
  arrowAngle: number

  constructor (opetions: { style: ShapeStyle, segments: TSegment[], arrowRadius: number, arrowAngle: number }) {
    this.style = opetions.style
    this.segments = opetions.segments
    this.arrowRadius = opetions.arrowRadius
    this.arrowAngle = opetions.arrowAngle
  }
}
