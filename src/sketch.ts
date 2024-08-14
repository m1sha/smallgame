import { ShapeStyle, TShapeStyle, applyStroke } from './styles/shape-style'
import { Drawable } from './drawable'
import { Surface } from './surface'
import { Rect, TRect } from './rect'
import { Point, TPoint } from './point'
import { Shape, Rectangle, Circle, Line } from './shapes'


export class Sketch extends Drawable {
  private _shapes: Shape[] = []
  x: number = 0
  y: number = 0
  sx: number = 1
  sy: number = 1

  rect (style: ShapeStyle | TShapeStyle, rect: Rect | TRect): Rectangle & { style: ShapeStyle }  {
    const shape: Shape = { type: 'rectangle', ...rect, style: ShapeStyle.from(style) }
    this._shapes.push(shape)
    return shape
  }

  circle (style: ShapeStyle | TShapeStyle, center: Point | TPoint, radius: number): Circle & { style: ShapeStyle }  {
    const shape: Shape = { type: 'circle', ...center, radius, style: ShapeStyle.from(style), x : center.x, y: center.y }
    this._shapes.push(shape)
    return shape
  }

  line (style: ShapeStyle | TShapeStyle, p0: Point | TPoint, p1: Point | TPoint): Line & { style: ShapeStyle }  {
    const shape: Shape = {  type: 'line', p0, p1, style: ShapeStyle.from(style) }
    this._shapes.push(shape)
    return shape
  }

  draw (suface: Surface): void {
    for (const shape of this._shapes) {
      suface.draw.beginPath()
      if (shape.style.stroke) applyStroke(suface.draw as any, shape.style)
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
        case 'line': {
          suface.draw.moveTo(this.x + shape.p0.x * this.sx, this.y + shape.p0.y * this.sy)
          suface.draw.lineTo(this.x + shape.p1.x * this.sx, this.y + shape.p1.y * this.sy)
          break
        }
      }

      if (shape.style.fillStrokeOrder === 'stroke-first') {
        if (shape.style.stroke) suface.draw.stroke()
        if (shape.style.fill) suface.draw.fill()
        
        return
      }
      
      if (shape.style.fill) suface.draw.fill()
      if (shape.style.stroke) suface.draw.stroke()
    }
  }

  toSurface (width: number, height: number) {
    const suface = new Surface(width, height)
    this.draw(suface)
    return suface
  }
}