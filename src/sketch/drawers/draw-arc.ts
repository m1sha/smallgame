import { Arc } from "../../shapes"
import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { drawShape } from "./draw-shape"

export function drawArc (shape: Arc, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.beginPath()
  surface.draw.arc(shift.x + shape.x * scale.x, shift.y + shape.y * scale.y, shape.radius * scale.x, shape.startAngle, shape.endAngle, shape.counterclockwise)
  drawShape(shape, surface)
}