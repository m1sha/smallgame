import { Arrow } from "../../shapes"
import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { drawShape } from "./draw-shape"
import { applyFill } from "../../styles/shape-style"
import { calcArrowHead } from "../../gmath"

export function drawArrow (shape: Arrow, surface: Surface, shift: TPoint, scale: TPoint) {
  const { p0, p1 } = shape
  surface.draw.moveTo(shift.x + p0.x * scale.x, shift.y + p0.y * scale.y)
  surface.draw.lineTo(shift.x + p1.x * scale.x, shift.y + p1.y * scale.y)
  drawShape(shape, surface)
            
  if (shape.options.end) {
    surface.draw.beginPath()
    const points = calcArrowHead({ p0, p1 }, 1, shape.options.end.arrowRadius ?? 0, shape.options.end.arrowAngle ?? 0)
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
  }

  if (shape.options.start) {
    debugger
    surface.draw.beginPath()
    const points = calcArrowHead({ p0, p1 }, -1, shape.options.start.arrowRadius ?? 0, shape.options.start.arrowAngle ?? 0)
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
  }
            
  surface.draw.beginPath()
}