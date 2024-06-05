import { ShapeStyle } from './shape-style'
import { Drawable } from './drawable'
import { Surface } from './surface'
import { Rect, TRect } from './rect'
import { Point, TPoint } from './point'
import { Shape, Rectangle, Circle } from './shapes'


export class Sketch extends Drawable {
  private _shapes: Shape[] = []
  x: number = 0
  y: number = 0
  sx: number = 1
  sy: number = 1

  rect(style: ShapeStyle, rect: Rect | TRect): Rectangle {
    const shape: Shape = { type: 'rectangle', ...rect, style }
    this._shapes.push(shape)
    return shape
  }

  circle(style: ShapeStyle, center: Point | TPoint, radius: number): Circle {
    const shape: Shape = {  type: 'circle', ...center, radius,  style }
    this._shapes.push(shape)
    return shape
  }

  update(suface: Surface): void {
    
    for (const shape of this._shapes) {
      suface.draw.beginPath()
      if (shape.style.stroke) suface.draw.strokeStyle = shape.style.stroke
      if (shape.style.fill) suface.draw.fillStyle = shape.style.fill
      switch (shape.type) {
        case 'rectangle': {
          suface.draw.rect(this.x + shape.x * this.sx, this.y + shape.y * this.sy, shape.width * this.sx, shape.height * this.sy)
          break
        }
        case 'circle': {
          suface.draw.ellipse(this.x + shape.x * this.sx, this.y + shape.y * this.sy, shape.radius * this.sx, shape.radius * this.sy, 0, 0, 2*Math.PI)
          break
        }
          
      }

      if (shape.style.stroke)
        suface.draw.stroke()
      if (shape.style.fill)
        suface.draw.fill()
      
    }
  }
}