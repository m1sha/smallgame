import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { HLine } from "../../shapes"
import { drawShape } from "./draw-shape"

export function drawHLine (shape: HLine, surface: Surface, shift: TPoint, scale: TPoint) {
  //surface.draw.hline(shift.x + shape.p.x * scale.x, shift.y + shape.p.y * scale.y, shape.width)
  
  surface.draw.translate(-.5, -.5)
  surface.draw.moveTo(shift.x + shape.p.x * scale.x, shift.y + shape.p.y * scale.y)
  surface.draw.lineTo(shift.x + (shape.p.x + shape.width) * scale.x, shift.y + shape.p.y * scale.y)
  drawShape(shape, surface)
  surface.draw.translate(.5, .5)
}