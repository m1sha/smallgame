import { Rect, setRect, type TRect } from "../rect"
import { type Shape } from "./shape"
import { type Rectangle } from "./rectangle"
import { type RoundedRectangle } from "./roundedrect"
import { type Circle } from "./circle"
import { type Line } from "./line"
import { setPoint } from "../point"

export class Boundedrect {
  static getShapesBounds (shapes: Shape[]): Rect { 
    if (!shapes[0]) return Rect.zero
    const rects: TRect[] = []
    shapes.forEach(p => rects.push(this.getShapeBounds(p)))
    const rect = Rect.from(rects[0])
    for (let i = 1; i < rects.length; i++)
      rect.unionSelf(rects[i])
    return rect
  }
  static getShapeBounds (shape: Shape): TRect {
    switch (shape.type) {
      //case 'polyrectangle':
      case 'roundedrectangle':
      case 'rectangle': return this.getRectangle(shape)
      case 'circle': return this.getCircle(shape)
      case 'line': return this.getLine(shape)

      default: throw new Error(shape.type + ' type is unsupported')
    }
  }

  private static getRectangle(rect: Rectangle | RoundedRectangle): TRect {
    const border = rect.style.lineWidth
    return Rect.from(rect).outline(-border)
  }

  private static getCircle({ x, y, radius, style }: Circle): TRect {
    const border = style.lineWidth
    return setRect(x - radius, y - radius, radius * 2 + border, radius * 2 + border)
  }

  private static getLine ({ p0, p1, style }: Line): TRect {
    const border = style.lineWidth
    const min = setPoint(Math.min(p0.x, p1.y), Math.min(p0.x, p1.y))
    const max = setPoint(Math.max(p0.x, p1.y), Math.max(p0.x, p1.y))
    return new Rect(min.x, min.y, max.x - min.x, max.y - min.x).outline(-border)
  }

}