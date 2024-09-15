import { Pixels } from "./pixels"

export function ddaline (data: ImageData, color: [number, number, number, number], x0: number, y0: number, x1: number, y1: number): void { 
  const pixels = new Pixels(data)

  let dx = x1 - x0 
  let dy = y1 - y0 
  const length = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy) 
  dx /= length
  dy /= length
  let x = x0
  let y = y0
  pixels.setPixel(0 | x + 0.5, 0 | y + 0.5, color)
  for (let i = 0; i < length - 1; i++) { 
    x += dx 
    y += dy 
    pixels.setPixel(0 | x + 0.5, 0 | y + 0.5, color)
  } 
}
