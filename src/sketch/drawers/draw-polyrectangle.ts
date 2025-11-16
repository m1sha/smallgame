import { PolyRectangle } from "../../shapes"
import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { drawShape } from "./draw-shape"

export function drawPolyrect (shape: PolyRectangle, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.beginPath()
  surface.draw.moveTo(shift.x + shape.topLeft.x * scale.x, shift.y + shape.topLeft.y * scale.y)
  surface.draw.lineTo(shift.x + shape.topRight.x * scale.x, shift.y + shape.topRight.y * scale.y)
  surface.draw.lineTo(shift.x + shape.bottomRight.x * scale.x, shift.y + shape.bottomRight.y * scale.y)
  surface.draw.lineTo(shift.x + shape.bottomLeft.x * scale.x, shift.y + shape.bottomLeft.y * scale.y)
  surface.draw.closePath()
  drawShape(shape, surface)
}