import { Polygon } from "../../shapes"
import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { drawShape } from "./draw-shape"

export function drawPolygon (shape: Polygon, surface: Surface, shift: TPoint, scale: TPoint) {
  if (shape.points.length < 2) return
debugger
  //surface.draw.save()
  surface.draw.beginPath()
  surface.draw.moveTo(shift.x + shape.points[0].x * scale.x, shift.y + shape.points[0].y * scale.y)
  for (let i = 1; i < shape.points.length; i++) {
    surface.draw.lineTo(shift.x + shape.points[i].x * scale.x, shift.y + shape.points[i].y * scale.y)
    drawShape(shape, surface)
  }
  surface.draw.moveTo(shift.x + shape.points[0].x * scale.x, shift.y + shape.points[0].y * scale.y)
  drawShape(shape, surface)
  //surface.draw.restore()
  
  // for (let i = 1; i < shape.points.length; i++) {
  //   surface.draw.moveTo(shift.x + shape.points[i - 1].x * shift.x, shift.y + shape.points[i - 1].y * shift.y)
  //   surface.draw.lineTo(shift.x + shape.points[i].x * shift.x, shift.y + shape.points[i].y * shift.y)
  // }
  // //surface.draw.closePath()
  // drawShape(shape, surface)
  // //surface.draw.beginPath()
  // //surface.draw.restore()
}