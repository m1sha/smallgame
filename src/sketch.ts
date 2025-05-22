import { ShapeStyle, TShapeStyle, applyStroke, applyFill } from './styles/shape-style'
import { Drawable } from './drawable'
import { Surface } from './surface'
import { PolyRect, Rect, TRect } from './rect'
import { Point, setPoint, TPoint } from './point'
import { Shape, Rectangle, PolyRectangle, Circle, Line, RoundedRectangle, VLine, HLine, Polygon, Polydots, Arrows } from './shapes'
import { Boundedrect } from './shapes/boundedrect'
import { type TSegment } from './segment'
import { CoordinateSystem } from './coords'

export class Sketch extends Drawable {
  private _shapes: Shape[] = []
  private _styleList: Record<string, ShapeStyle> = {}
  x: number = 0
  y: number = 0
  sx: number = 1
  sy: number = 1
  

  defineStyle (name: string, style: TShapeStyle): ShapeStyle {
    return this._styleList[name] = ShapeStyle.from(style)
  }

  get styleNames () { return Object.keys(this._styleList) }

  getStyle (name: string) { return this._styleList[name] }

  copyStyles (source: Sketch) { 
    if (!source) throw new Error('source is undefined')
    this._styleList = source._styleList 
  }

  cloneStyles (source: Sketch) {
    if (!source) throw new Error('source is undefined') 
    this._styleList = {} 
    const names = source.styleNames
    for (const name of names)
      this._styleList[name] = source._styleList[name].clone()
  }

  clear () {
    this._shapes = []
  }

  rect (style: ShapeStyle | TShapeStyle | string, rect: Rect | TRect): Rectangle  {
    const shape: Shape = { type: 'rectangle', ...rect, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  rects (style: ShapeStyle | TShapeStyle | string, rect: Rect | TRect, cols: number = 1, rows: number = 1, skipRows: number = 0 ): Rectangle[]  {
    const result: Rectangle[] = []
    for (let i = 0; i < rows; i++) {
      if (i < skipRows) continue
      for (let j = 0; j < cols; j++) { 
        const r = rect instanceof Rect ? rect : Rect.from(rect)
        const shape: Shape = { type: 'rectangle', ...r.move(j * r.width + r.x, i * r.height + r.y), style: this.initStyle(style) }
        this._shapes.push(shape)
        result.push(shape)
      }
    }
    return result
  }

  polyrect (style: ShapeStyle | TShapeStyle | string, { topLeft, topRight, bottomLeft, bottomRight }: PolyRect): PolyRectangle {
    const shape: Shape = { type: 'polyrectangle', topLeft, topRight, bottomLeft, bottomRight, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  polygon (style: ShapeStyle | TShapeStyle | string, points: TPoint[]): Polygon {
    const shape: Shape = { type: 'polygon', points, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  dots (style: ShapeStyle | TShapeStyle | string, points: TPoint[], radius: number = 1): Polydots {
    const shape: Shape = { type: 'polydots', points, radius, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  arrows (style: ShapeStyle | TShapeStyle | string, segments: TSegment[], options?: { arrowRadius?: number, arrowAngle?: number }): Arrows {
    const arrowRadius = options && options.arrowRadius ? options.arrowRadius : 12
    const arrowAngle = options && options.arrowAngle ? options.arrowAngle : Math.PI / 7
    const shape: Shape = { type: 'arrows', segments, arrowRadius, arrowAngle, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  roundedrect (style: ShapeStyle | TShapeStyle | string, { x, y, width, height }: TRect, radii?: number | number[]): RoundedRectangle {
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

  circle (style: ShapeStyle | TShapeStyle | string, center: Point | TPoint, radius: number): Circle  {
    const shape: Shape = { type: 'circle', ...center, radius, style: this.initStyle(style), x : center.x, y: center.y }
    this._shapes.push(shape)
    return shape
  }

  line (style: ShapeStyle | TShapeStyle | string, p0: Point | TPoint, p1: Point | TPoint): Line  {
    const shape: Shape = {  type: 'line', p0, p1, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  vline (style: ShapeStyle | TShapeStyle | string, p: Point | TPoint, height: number): VLine  {
    const shape: Shape = {  type: 'vline', p, height, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  hline (style: ShapeStyle | TShapeStyle | string, p: Point | TPoint, width: number): HLine  {
    const shape: Shape = {  type: 'hline', p, width, style: this.initStyle(style) }
    this._shapes.push(shape)
    return shape
  }

  segmentline (style: ShapeStyle | TShapeStyle | string, startPoint: Point | TPoint) {
    const points: TPoint[] = []
    const shape: Shape = { 
      type: 'segmentline', 
      startPoint, 
      points, 
      style: this.initStyle(style),
      addSegment: (point: Point | TPoint) => points.push(point)
    }
    this._shapes.push(shape)
    return shape
  }

  setPixel (style: ShapeStyle | TShapeStyle | string, point: Point | TPoint) {
    const shape: Shape = { 
      type: 'pixel', 
      x: point.x, 
      y: point.y, 
      style: this.initStyle(style),
    }
    this._shapes.push(shape)
    return shape
  }

  draw (suface: Surface): void {
    for (const shape of this._shapes) {
      
      suface.draw.beginPath()
      if (shape.style.stroke) applyStroke(suface.draw as any, shape.style)
      if (shape.style.fill) applyFill(suface.draw as any, shape.style.fill)
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
        case 'polygon': {
          if (shape.points.length < 2) return
          suface.draw.moveTo(this.x + shape.points[0].x * this.sx, this.y + shape.points[0].y * this.sy)
          for (let i = 1; i < shape.points.length; i++) {
            suface.draw.lineTo(this.x + shape.points[i].x * this.sx, this.y + shape.points[i].y * this.sy)
          }
          suface.draw.closePath()
          break
        }
        case 'polydots': {
          for (let i = 0; i < shape.points.length; i++) {
            suface.draw.ellipse(
              this.x + shape.points[i].x * this.sx, 
              this.y + shape.points[i].y * this.sy, 
              shape.radius * this.sx, 
              shape.radius * this.sy, 0, 0, 2*Math.PI
            )
            this.pushToBlitQueue(shape, suface)
            suface.draw.beginPath()
          }
          break
        }
        case 'arrows':
          const alfa = (vector: TSegment): number => {
            const { x, y } = setPoint(vector.p1.x - vector.p0.x, vector.p1.y - vector.p0.y) //new Point(vector.ep).dec(vector.sp)
            return Math.atan2(y, x)
          }

          const arrow = (vector: TSegment, dir: number): TPoint[] => {
            const result = []
            const angle = alfa(vector)
            const point = dir < 0 ? vector.p0 : vector.p1
            const r = shape.arrowRadius
            const turn = shape.arrowAngle
            const cos1 = dir * Math.cos(angle - turn)
            const sin1 = dir * Math.sin(angle - turn)
            result.push({ x: point.x - r * cos1, y: point.y - r * sin1 })
            result.push({ x: point.x, y: point.y })
            result.push({ x: point.x, y: point.y })
            const cos2 = dir * Math.cos(angle + turn)
            const sin2 = dir * Math.sin(angle + turn)
            result.push({ x: point.x - r * cos2, y: point.y - r * sin2 })
            return result
          }

          for (let i = 0; i < shape.segments.length; i++) {
            const { p0, p1 } = shape.segments[i]
            suface.draw.moveTo(this.x + p0.x * this.sx, this.y + p0.y * this.sy)
            suface.draw.lineTo(this.x + p1.x * this.sx, this.y + p1.y * this.sy)
            this.pushToBlitQueue(shape, suface)
            suface.draw.beginPath()
            const points = arrow(shape.segments[i], 1)
            suface.draw.moveTo(this.x + points[0].x * this.sx, this.y + points[0].y * this.sy)
            for (let j = 1; j < points.length; j++) {
              const p = points[j]
              const x = this.x + p.x * this.sx 
              const y = this.y + p.y * this.sy
              suface.draw.lineTo(x, y)
            }
            suface.draw.closePath()
            applyFill(suface.draw as any, shape.style.stroke)
            suface.draw.fill()
            suface.draw.beginPath()
          }
          break
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
        case 'vline': {
          suface.draw.vline(this.x + shape.p.x * this.sx, this.y + shape.p.y * this.sy, shape.height)
          break
        }
        case 'hline': {
          suface.draw.hline(this.x + shape.p.x * this.sx, this.y + shape.p.y * this.sy, shape.width)
          break
        }
        case 'segmentline': {
          const startPoint = shape.startPoint
          suface.draw.moveTo(this.x + startPoint.x * this.sx, this.y + startPoint.y * this.sy)
          for (const point of shape.points) {
            suface.draw.lineTo(this.x + point.x * this.sx, this.y + point.y * this.sy)
            suface.draw.moveTo(this.x + point.x * this.sx, this.y + point.y * this.sy)
          }
          break
        }
        case 'pixel': {
          suface.draw.fillRect(this.x + shape.x * this.sx, this.y + shape.y * this.sy, 1, 1)
          continue
        }
      }

      this.pushToBlitQueue(shape, suface)
    }
  }

  get bounds () {
    return Boundedrect.getShapesBounds(this._shapes)
  }

  toSurface (width?: number, height?: number, coordinateSystem?: CoordinateSystem) {
    let w = 0; let h = 0
    
    if (!width || !height) {
      const { absWidth, absHeight } = this.bounds
      w = absWidth; h = absHeight
    } else {
      w = width; h = height
    }

    const suface = new Surface(w, h, { coordinateSystem })
    this.draw(suface)
    return suface
  }

  toPattern (repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat", width?: number, height?: number, coordinateSystem?: CoordinateSystem): CanvasPattern  {
    return this.toSurface(width, height, coordinateSystem).toPattern(repetition)
  }

  private pushToBlitQueue(shape: Shape, suface: Surface) {
    if (shape.style.paintOrder === 'stroke') {
      if (shape.style.stroke) suface.draw.stroke()
      if (shape.style.fill) suface.draw.fill()
      return
    }
    
    if (shape.style.fill) suface.draw.fill()
    if (shape.style.stroke) suface.draw.stroke()
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