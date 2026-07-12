import { Pie } from "../../shapes"
import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { drawShape } from "./draw-shape"

export function drawPie (shape: Pie, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.beginPath()
  surface.draw.moveTo(shift.x + shape.x * scale.x, shift.y + shape.y * scale.y)
  surface.draw.arc(shift.x + shape.x * scale.x, shift.y + shape.y * scale.y, shape.radius * scale.x, shape.startAngle, shape.endAngle, shape.counterclockwise)
  surface.draw.closePath()
  drawShape(shape, surface)
}