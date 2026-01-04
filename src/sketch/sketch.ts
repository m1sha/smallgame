import { ShapeStyle, type TShapeStyle, applyStroke, applyFill, type ShapeStyleTypes, ShapeStyleResolver } from '../styles/shape-style'
import { Drawable } from '../drawable'
import { Surface } from '../surface'
import { PolyRect, Rect, type TRect } from '../rect'
import { Point, type TPoint } from '../point'
import { type Shape, type Rectangle } from '../shapes'
import { Boundedrect } from '../shapes/boundedrect'
import { type TSegment } from '../segment'
import { type CoordinateSystem } from '../coords'
import { type TArrowDrawOptions, ArrowDrawOptions, RectDrawOptions, type TRectDrawOptions } from './options'
import { drawerMap } from './drawers'

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

  rect (style: ShapeStyle | TShapeStyle | string, rect: Rect | TRect): Sketch  {
    const shape: Shape = { type: 'rectangle', ...rect, style: this.initStyle(style) }
    this._shapes.push(shape)
    return this
  }

  rects (style: ShapeStyleTypes | ShapeStyleTypes[] | ShapeStyleTypes[][], rect: Rect | TRect, cols: number = 1, rows: number = 1, options?: TRectDrawOptions): Sketch  {
    const result: Rectangle[] = []
    const { skipRows, gap } = new RectDrawOptions(options)
    const resolver = new ShapeStyleResolver(style)
    for (let i = 0; i < rows; i++) {
      if (i < skipRows) continue
      for (let j = 0; j < cols; j++) { 
        const r = rect instanceof Rect ? rect : Rect.from(rect)
        const shapeStyle = resolver.get(j, i)
        const shape: Shape = { type: 'rectangle', ...r.move(j * r.width + r.x + gap * j, i * r.height + r.y + gap * i), style: this.initStyle(shapeStyle) }
        this._shapes.push(shape)
        result.push(shape)
      }
    }
    return this
  }

  polyrect (style: ShapeStyle | TShapeStyle | string, { topLeft, topRight, bottomLeft, bottomRight }: PolyRect): Sketch {
    const shape: Shape = { type: 'polyrectangle', topLeft, topRight, bottomLeft, bottomRight, style: this.initStyle(style) }
    this._shapes.push(shape)
    return this
  }

  polygon (style: ShapeStyle | TShapeStyle | string, points: TPoint[]): Sketch {
    const shape: Shape = { type: 'polygon', points, style: this.initStyle(style) }
    this._shapes.push(shape)
    return this
  }

  dots (style: ShapeStyle | TShapeStyle | string, points: TPoint[], radius: number = 1): Sketch {
    const shape: Shape = { type: 'polydots', points, radius, style: this.initStyle(style) }
    this._shapes.push(shape)
    return this
  }

  arrows (style: ShapeStyle | TShapeStyle | string, segments: TSegment[], options?: { arrowRadius?: number, arrowAngle?: number }): Sketch {
    const arrowRadius = options && options.arrowRadius ? options.arrowRadius : 12
    const arrowAngle = options && options.arrowAngle ? options.arrowAngle : Math.PI / 7
    const shape: Shape = { type: 'arrows', segments, arrowRadius, arrowAngle, style: this.initStyle(style) }
    this._shapes.push(shape)
    return this
  }

  arrow (style: ShapeStyle | TShapeStyle | string, p0: TPoint, p1: TPoint, options?: TArrowDrawOptions): Sketch {
    const shape: Shape = { type: 'arrow', p0, p1, style: this.initStyle(style), options: ArrowDrawOptions.from(options) }
    this._shapes.push(shape)
    return this
  }

  roundedrect (style: ShapeStyle | TShapeStyle | string, { x, y, width, height }: TRect, radii?: number | number[]): Sketch {
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
    return this
  }

  circle (style: ShapeStyle | TShapeStyle | string, center: Point | TPoint, radius: number): Sketch  {
    const shape: Shape = { type: 'circle', ...center, radius, style: this.initStyle(style), x : center.x, y: center.y }
    this._shapes.push(shape)
    return this
  }

  line (style: ShapeStyle | TShapeStyle | string, p0: Point | TPoint, p1: Point | TPoint): Sketch  {
    const shape: Shape = {  type: 'line', p0, p1, style: this.initStyle(style) }
    this._shapes.push(shape)
    return this
  }

  vline (style: ShapeStyle | TShapeStyle | string, p: Point | TPoint, height: number): Sketch  {
    const shape: Shape = {  type: 'vline', p, height, style: this.initStyle(style) }
    this._shapes.push(shape)
    return this
  }

  hline (style: ShapeStyle | TShapeStyle | string, p: Point | TPoint, width: number): Sketch  {
    const shape: Shape = {  type: 'hline', p, width, style: this.initStyle(style) }
    this._shapes.push(shape)
    return this
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

  cubicBezier (style: ShapeStyle | TShapeStyle | string, a: TPoint, b: TPoint, cp1: TPoint, cp2: TPoint) {
    const shape: Shape = { 
      type: 'cubicbezier', 
      a, b, cp1, cp2,
      style: this.initStyle(style),
    }
    this._shapes.push(shape)
    return this
  }

  draw (suface: Surface): void {
    const shift = new Point(this.x, this.y)
    const scale = new Point(this.sx, this.sy)
    
    for (const shape of this._shapes) {
      suface.draw.save()  
      if (shape.style.stroke) applyStroke(suface.draw as any, shape.style)
      if (shape.style.fill) applyFill(suface.draw as any, shape.style.fill)
        
      drawerMap.get(shape.type)?.(shape, suface, shift, scale)
      suface.draw.restore()  
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

  // private drawShape(shape: Shape, suface: Surface) {
  //   if (shape.style.paintOrder === 'stroke') {
  //     if (shape.style.stroke) suface.draw.stroke()
  //     if (shape.style.fill) suface.draw.fill()
  //     return
  //   }
    
  //   if (shape.style.fill) suface.draw.fill()
  //   if (shape.style.stroke) suface.draw.stroke()
  // }

  private initStyle (style: ShapeStyle | TShapeStyle | string): ShapeStyle {
    if (typeof style === 'string' || style instanceof String) {
      const st = this._styleList[style as string]
      if (!st) throw new Error(style + ' is not found.')
      return st
    }
    return ShapeStyle.from(style)
  }

  static new () {
    return new Sketch()
  }
}