import { TPoint } from "../../point"
import { Surface } from "../../surface"
import { Pixel } from "../../shapes"

export function drawPixel (shape: Pixel, surface: Surface, shift: TPoint, scale: TPoint) {
  surface.draw.fillRect(shift.x + shape.x * scale.x, shift.y + shape.y * scale.y, 1, 1)
}