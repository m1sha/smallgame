import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { Rectangle } from "../../shapes"
import { drawShape } from "./draw-shape"

export function drawRect (shape: Rectangle, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.beginPath()
  surface.draw.rect(shift.x + shape.x * scale.x, shift.y + shape.y * scale.y, shape.width * scale.x, shape.height * scale.y)
  surface.draw.closePath()
  drawShape(shape, surface)
}