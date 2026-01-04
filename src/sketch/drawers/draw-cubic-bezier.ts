import { CubicBezier } from "../../shapes/cubic-bezier"
import { Surface } from "../../surface"
import { TPoint } from "../../point"
import { drawShape } from "./draw-shape"

export function drawCubicbezier (shape: CubicBezier, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.beginPath()
  surface.draw.moveTo(shape.a.x, shape.a.y)
  surface.draw.bezierCurveTo(shape.cp1.x, shape.cp1.y, shape.cp2.x, shape.cp2.y, shape.b.x, shape.b.y)
  drawShape(shape, surface)
}