import { Arrows } from "../../shapes"
import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { calcArrowHead } from "../../gmath"
import { drawShape } from "./draw-shape"
import { applyFill } from "../../styles/shape-style"

export function drawArrows (shape: Arrows, surface: Surface, shift: TPoint, scale: TPoint) {
  for (let i = 0; i < shape.segments.length; i++) {
    const { p0, p1 } = shape.segments[i]
    surface.draw.moveTo(shift.x + p0.x * scale.x, shift.y + p0.y * scale.y)
    surface.draw.lineTo(shift.x + p1.x * scale.x, shift.y + p1.y * scale.y)
    drawShape(shape, surface)
    surface.draw.beginPath()
    const points = calcArrowHead(shape.segments[i], 1, shape.arrowRadius, shape.arrowAngle)
    surface.draw.moveTo(shift.x + points[0].x * scale.x, shift.y + points[0].y * scale.y)
    for (let j = 1; j < points.length; j++) {
      const p = points[j]
      const x = shift.x + p.x * scale.x 
      const y = shift.y + p.y * scale.y
      surface.draw.lineTo(x, y)
    }
    surface.draw.closePath()
    applyFill(surface.draw as any, shape.style.stroke)
    surface.draw.fill()
    surface.draw.beginPath()
  }
}