import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { HLine } from "../../shapes"

export function drawHLine (shape: HLine, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.hline(shift.x + shape.p.x * scale.x, shift.y + shape.p.y * scale.y, shape.width)
}