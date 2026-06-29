import { ArcTo } from "../../shapes"
import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { drawShape } from "./draw-shape"

export function drawArcTo (shape: ArcTo, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.beginPath()
  surface.draw.moveTo(shift.x + shape.p0.x * scale.x, shift.y + shape.p0.y * scale.y)
  surface.draw.arcTo(
    shift.x + shape.p1.x * scale.x, shift.y + shape.p1.y * scale.y, 
    shift.x + shape.p2.x * scale.x, shift.y + shape.p2.y * scale.y, 
    shape.radius * scale.x
  )
  drawShape(shape, surface)
}