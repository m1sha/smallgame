import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { VLine } from "../../shapes"

export function drawVLine (shape: VLine, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.vline(shift.x + shape.p.x * scale.x, shift.y + shape.p.y * scale.y, shape.height)
}