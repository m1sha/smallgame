import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { Line } from "../../shapes"
import { drawShape } from "./draw-shape"

export function drawLine (shape: Line, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.moveTo(shift.x + shape.p0.x * scale.x, shift.y + shape.p0.y * scale.y)
  surface.draw.lineTo(shift.x + shape.p1.x * scale.x, shift.y + shape.p1.y * scale.y)
  drawShape(shape, surface)
}