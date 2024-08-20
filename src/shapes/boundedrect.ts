import { copyRect, Rect, setRect, TRect } from "../rect";
import { Shape } from "./shape"
import { Rectangle } from "./rectangle";
import { RoundedRectangle } from "./roundedrect";
import { Circle } from "./circle";
import { Line } from "./line";
import { setPoint } from "point";

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
    return copyRect(rect)
  }

  private static getCircle({ x, y, radius}: Circle): TRect {
    return setRect(x - radius, y - radius, radius * 2, radius * 2)
  }

  private static getLine ({ p0, p1 }: Line): TRect {
    const min = setPoint(Math.min(p0.x, p1.y), Math.min(p0.x, p1.y))
    const max = setPoint(Math.max(p0.x, p1.y), Math.max(p0.x, p1.y))
    return setRect(min.x, min.y, max.x - min.x, max.y - min.x)
  }

}