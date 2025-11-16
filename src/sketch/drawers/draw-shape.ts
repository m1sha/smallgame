import { Shape } from "../../shapes"
import { Surface } from "../../surface"

export function drawShape(shape: Shape, surface: Surface) {
  if (shape.style.paintOrder === 'stroke') {
    if (shape.style.stroke) surface.draw.stroke()
    if (shape.style.fill) surface.draw.fill()
    return
  }
    
  if (shape.style.fill) surface.draw.fill()
  if (shape.style.stroke) surface.draw.stroke()
}