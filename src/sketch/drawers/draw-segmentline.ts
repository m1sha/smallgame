import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { SegmentLine } from "../../shapes"

export function drawSegmentLine (shape: SegmentLine, surface: Surface, shift: TPoint, scale: TPoint) {
  const startPoint = shape.startPoint
  surface.draw.moveTo(shift.x + startPoint.x * scale.x, shift.y + startPoint.y * scale.y)
  for (const point of shape.points) {
    surface.draw.lineTo(shift.x + point.x * scale.x, shift.y + point.y * scale.y)
    surface.draw.moveTo(shift.x + point.x * scale.x, shift.y + point.y * scale.y)
  }
}