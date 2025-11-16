import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { RoundedRectangle } from "../../shapes"

export function drawRoundedRectangle (shape: RoundedRectangle, surface: Surface, shift: TPoint, scale: TPoint) {
  const radii = [shape.topLeft, shape.topRight, shape.bottomRight, shape.bottomLeft].filter(p => p)
  surface.draw.roundRect(shift.x + shape.x * scale.x, shift.y + shape.y * scale.y, shape.width * scale.x, shape.height * scale.y, radii)
}