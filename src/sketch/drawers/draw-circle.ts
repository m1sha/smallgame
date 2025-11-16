import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { Circle } from "../../shapes"
import { drawShape } from "./draw-shape"

export function drawCircle (shape: Circle, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.beginPath()
  surface.draw.ellipse(shift.x + shape.x * scale.x, shift.y + shape.y * scale.y, shape.radius * scale.x, shape.radius * scale.y, 0, 0, 2*Math.PI)
  drawShape(shape, surface)
}