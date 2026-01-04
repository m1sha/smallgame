import { Polydots, Shape } from "../../shapes"
import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { drawShape } from "./draw-shape"

export function drawPolydots (shape: Polydots, surface: Surface, shift: TPoint, scale: TPoint) {
  //surface.draw.save()
  for (let i = 0; i < shape.points.length; i++) {
    surface.draw.beginPath()
    surface.draw.ellipse(
      shift.x + shape.points[i].x * scale.x, 
      shift.y + shape.points[i].y * scale.y, 
      shape.radius * scale.x, 
      shape.radius * scale.y, 0, 0, 2*Math.PI
    )
    drawShape(shape, surface)
    //surface.draw.beginPath()
  }
  //surface.draw.restore()
}

