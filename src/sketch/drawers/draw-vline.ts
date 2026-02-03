import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { VLine } from "../../shapes"
import { drawShape } from "./draw-shape"

export function drawVLine (shape: VLine, surface: Surface, shift: TPoint, scale: TPoint) {
  //surface.draw.vline(shift.x + shape.p.x * scale.x, shift.y + shape.p.y * scale.y, shape.height)
  surface.draw.translate(-.5, -.5)
  surface.draw.moveTo(shift.x + shape.p.x * scale.x, shift.y + shape.p.y * scale.y)
  surface.draw.lineTo(shift.x + shape.p.x * scale.x, shift.y + (shape.p.y + shape.height) * scale.y)
  drawShape(shape, surface)
  surface.draw.translate(.5, .5)
}