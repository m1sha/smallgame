import { Rect, TRect } from "../rect"
import { Size, TSize } from "../size"

export function uniformRandomScatter <T extends { rect: Rect }>(fieldSize: TSize | TRect, objects: T[], maxAttempts: number = 10_000): void {
  if (!objects || !objects.length) return
  
  objects.sort(() => Math.random() - 0.5)

  let x = 0, y = 0
  if (typeof (fieldSize as any).x === 'number' && typeof (fieldSize as any).y === 'number') {
    x = (fieldSize as any).x
    y = (fieldSize as any).y
  }

  const placed: TRect[] = []

  for (const obj of objects) {
    const { rect } = obj
   
    if (!insideField(rect, fieldSize)) {
      continue
    }

    let attempt = 0
    let placedSuccessfully = false

    while (attempt < maxAttempts && !placedSuccessfully) {
      const randomX = Math.floor(randIn(0, fieldSize.width - rect.width))
      const randomY = Math.floor(randIn(0, fieldSize.height - rect.height))

      const candidate: TRect = {
        x: randomX + x,
        y: randomY + y,
        width: rect.width,
        height: rect.height,
      }

      let overlap = false;
      for (const other of placed) {
        if (rectsIntersect(candidate, other)) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        rect.x = candidate.x
        rect.y = candidate.y
        placed.push(candidate)
        placedSuccessfully = true
      }

      attempt++
    }

    if (!placedSuccessfully) { }
  }
}

function randIn(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}


function rectsIntersect(a: TRect, b: TRect): boolean {
  return !(
    a.x + a.width <= b.x ||
    a.x >= b.x + b.width ||
    a.y + a.height <= b.y ||
    a.y >= b.y + b.height
  );
}


function insideField(obj: TRect, field: TSize): boolean {
  return (
    obj.x >= 0 &&
    obj.y >= 0 &&
    obj.x + obj.width <= field.width &&
    obj.y + obj.height <= field.height
  );
}
