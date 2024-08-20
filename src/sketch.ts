import { ShapeStyle, TShapeStyle, applyStroke } from './styles/shape-style'
import { Drawable } from './drawable'
import { Surface } from './surface'
import { PolyRect, Rect, TRect } from './rect'
import { Point, TPoint } from './point'
import { Shape, Rectangle, PolyRectangle, Circle, Line, RoundedRectangle } from './shapes'
import { Boundedrect } from './shapes/boundedrect'

export class Sketch extends Drawable {
  private _shapes: Shape[] = []
  private _styleList: Record<string, ShapeStyle> = {}
  x: number = 0
  y: number = 0
  sx: number = 1
  sy: number = 1
  aa: boolean = false // if true a line thickness 1px

  defineStyle (name: string, style: TShapeStyle): ShapeStyle {
    return this._styleList[name] = ShapeStyle.from(style)
  }

  get styleNames () { return Object.keys(this._styleList) }

  getStyle (name: string) { return this._styleList[name] }

  copyStyles (sketch: Sketch) { sketch._styleList = this._styleList }

  cloneStyles (sketch: Sketch) { 
    sketch._styleList = {} 
    const names = this.styleNames
    for (const name of names)
      sketch._styleList[name] = this._styleList[name].clone()
  }

  rect (style: ShapeStyle | TShapeStyle | string, rect: Rect | TRect): Rectangle & { style: ShapeStyle }  {
    const shape: Shape = { type: 'rectangle', ...rect, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  polyrect (style: ShapeStyle | TShapeStyle | string, { topLeft, topRight, bottomLeft, bottomRight }: PolyRect): PolyRectangle & { style: ShapeStyle } {
    const shape: Shape = { type: 'polyrectangle', topLeft, topRight, bottomLeft, bottomRight, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  roundedrect (style: ShapeStyle | TShapeStyle | string, { x, y, width, height }: TRect, radii?: number | number[]): RoundedRectangle & { style: ShapeStyle } {
    let topLeft = 0; let topRight = 0; let bottomRight = 0; let bottomLeft = 0;
    if (radii) {
      if (typeof radii === 'number') {
        topLeft = topRight = bottomRight = bottomLeft = radii
      }
      if (Array.isArray(radii)) {
        topLeft = radii[0]; topRight = radii[1]; bottomRight = radii[2]; bottomLeft = radii[3]
      }
    }

    const shape: Shape = { type: 'roundedrectangle', x, y, width, height, topLeft, topRight, bottomRight, bottomLeft, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  circle (style: ShapeStyle | TShapeStyle | string, center: Point | TPoint, radius: number): Circle & { style: ShapeStyle }  {
    const shape: Shape = { type: 'circle', ...center, radius, style: this.initStyle(style), x : center.x, y: center.y }
    this._shapes.push(shape)
    return shape
  }

  line (style: ShapeStyle | TShapeStyle | string, p0: Point | TPoint, p1: Point | TPoint): Line & { style: ShapeStyle }  {
    const shape: Shape = {  type: 'line', p0, p1, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  draw (suface: Surface): void {
    for (const shape of this._shapes) {
      if (this.aa) suface.draw.translate(0.5, 0.5)
      suface.draw.beginPath()
      if (shape.style.stroke) applyStroke(suface.draw as any, shape.style)
      if (shape.style.fill) suface.draw.fillStyle = shape.style.fill
      switch (shape.type) {
        case 'rectangle': {
          suface.draw.rect(this.x + shape.x * this.sx, this.y + shape.y * this.sy, shape.width * this.sx, shape.height * this.sy)
          break
        }
        case 'polyrectangle': {
          suface.draw.moveTo(this.x + shape.topLeft.x * this.sx, this.y + shape.topLeft.y * this.sy)
          suface.draw.lineTo(this.x + shape.topRight.x * this.sx, this.y + shape.topRight.y * this.sy)
          suface.draw.lineTo(this.x + shape.bottomRight.x * this.sx, this.y + shape.bottomRight.y * this.sy)
          suface.draw.lineTo(this.x + shape.bottomLeft.x * this.sx, this.y + shape.bottomLeft.y * this.sy)
          suface.draw.closePath()
          break
        }
        case 'roundedrectangle': {
          const radii = [shape.topLeft, shape.topRight, shape.bottomRight, shape.bottomLeft].filter(p => p)
          suface.draw.roundRect(this.x + shape.x * this.sx, this.y + shape.y * this.sy, shape.width * this.sx, shape.height * this.sy, radii)
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
        if (this.aa) suface.draw.resetTransform()
        return
      }
      
      if (shape.style.fill) suface.draw.fill()
      if (shape.style.stroke) suface.draw.stroke()
      if (this.aa) suface.draw.resetTransform()
    }
  }

  get bounds () {
    return Boundedrect.getShapesBounds(this._shapes)
  }

  toSurface (width?: number, height?: number) {
    let w = 0; let h = 0
    
    if (!width || !height) {
      const { absWidth, absHeight } = this.bounds
      w = absWidth; h = absHeight
    } else {
      w = width; h = height
    }

    const suface = new Surface(w, h)
    this.draw(suface)
    return suface
  }

  private initStyle (style: ShapeStyle | TShapeStyle | string): ShapeStyle {
    if (typeof style === 'string' || style instanceof String) {
      const st = this._styleList[style as string]
      if (!st) throw new Error(style + ' is not found.')
      return st
    }
    return ShapeStyle.from(style)
  }
}