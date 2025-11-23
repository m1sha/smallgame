import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { HLine } from "../../shapes"
import { drawShape } from "./draw-shape"

export function drawHLine (shape: HLine, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.beginPath()
  surface.draw.hline(shift.x + shape.p.x * scale.x, shift.y + shape.p.y * scale.y, shape.width)
  //surface.draw.closePath()
  drawShape(shape, surface)
}