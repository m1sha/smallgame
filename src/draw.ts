import { setPoint, TPoint } from "./point"
import { CoordinateSystem, fromMathCoord } from "./coords"
import { ddaline } from "./utils/dda-line"
import { Rect } from "./rect"

export class Draw {
  #ctx: CanvasRenderingContext2D
  #conv: (point: TPoint) => TPoint

  constructor (ctx: CanvasRenderingContext2D, coordinateSystem: CoordinateSystem) {
    this.#ctx = ctx
    this.#conv = point => {
      switch (coordinateSystem) {
        case "screen": return point
        case "math": return fromMathCoord(point.x, point.y, ctx.canvas.width / 2, ctx.canvas.height / 2)
      }
    }
  }

  get origin () {
    return this.#ctx
  }

  roundRect (x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | Iterable<number | DOMPointInit>): void {
    const rect = Rect.fromTwoPoints(this.#conv(setPoint(x, y)), this.#conv(setPoint(x + w, y + h)))
    this.#ctx.roundRect(rect.x, rect.y, rect.width, rect.height, radii)
  }

  arc (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
    const rect = Rect.fromTwoPoints(this.#conv(setPoint(x, y)), this.#conv(setPoint(x + radius, y + radius)))
    this.#ctx.arc(rect.x, rect.y, rect.width, startAngle, endAngle, counterclockwise)
  }
    
  arcTo (x1: number, y1: number, x2: number, y2: number, radius: number): void {
    this.#ctx.arcTo(x1, y1, x2, y2, radius)
  }

  bezierCurveTo (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.#ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  }

  closePath (): void {
    this.#ctx.closePath()
  }
  
  ellipse (x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
    const rect = Rect.fromTwoPoints(this.#conv(setPoint(x, y)), this.#conv(setPoint(x + radiusX, y + radiusY)))
    this.#ctx.ellipse(rect.x, rect.y, rect.width, rect.height, rotation, startAngle, endAngle, counterclockwise)
  }
  
  lineTo (x: number, y: number): void{
    const point = this.#conv(setPoint(x, y))
    this.#ctx.lineTo(point.x, point.y)
  }
  
  moveTo (x: number, y: number): void{
    const point = this.#conv(setPoint(x, y))
    this.#ctx.moveTo(point.x, point.y)
  }
  
  quadraticCurveTo (cpx: number, cpy: number, x: number, y: number): void{
    this.#ctx.quadraticCurveTo(cpx, cpy, x, y)
  }
  
  rect (x: number, y: number, w: number, h: number): void {
    const rect = Rect.fromTwoPoints(this.#conv(setPoint(x, y)), this.#conv(setPoint(x + w, y + h)))
    this.#ctx.rect(rect.x, rect.y, rect.width, rect.height)
  }

  fillRect (x: number, y: number, w: number, h: number): void {
    const rect = Rect.fromTwoPoints(this.#conv(setPoint(x, y)), this.#conv(setPoint(x + w, y + h)))
    this.#ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
  }

  hline (x: number, y: number, w: number): void {
    const rect = Rect.fromTwoPoints(this.#conv(setPoint(x, y)), this.#conv(setPoint(x + w, y)))
    this.#ctx.fillRect(rect.x, rect.y, rect.width, 1)
  }

  vline (x: number, y: number, h: number): void {
    debugger
    const rect = Rect.fromTwoPoints(this.#conv(setPoint(x, y)), this.#conv(setPoint(x, y + h)))
    this.#ctx.fillRect(rect.x, rect.y, 1, rect.height)
  }

  ddaline (x0: number, y0: number, x1: number, y1: number, rgba: [number, number, number, number]) {
    const data = this.#ctx.getImageData(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height)
    ddaline(data, rgba, x0, y0, x1, y1)
    this.#ctx.putImageData(data, 0, 0)
  }

  get lineCap (): CanvasLineCap {
    return this.#ctx.lineCap
  }

  set lineCap (value: CanvasLineCap) {
    this.#ctx.lineCap = value
  }
    
  get lineDashOffset (): number {
    return this.#ctx.lineDashOffset
  }

  set lineDashOffset (value: number) {
    this.#ctx.lineDashOffset = value
  }
    
  get lineJoin (): CanvasLineJoin {
    return this.#ctx.lineJoin
  }

  set lineJoin (value: CanvasLineJoin) {
    this.#ctx.lineJoin = value
  }
  
  get lineWidth (): number {
    return this.#ctx.lineWidth
  }

  set lineWidth (value: number) {
    this.#ctx.lineWidth = value
  }
  
  get miterLimit (): number {
    return this.#ctx.miterLimit
  }

  set miterLimit (value: number) {
    this.#ctx.miterLimit = value
  }
  
  getLineDash (): number[] {
    return this.#ctx.getLineDash()
  }
    
  setLineDash(segments: number[]): void {
    this.#ctx.setLineDash(segments)
  }

  stroke () {
    this.#ctx.stroke()
  }

  fill () {
    this.#ctx.fill()
  }

  beginPath () {
    this.#ctx.beginPath()
  }
  
  get fillStyle () : string | CanvasGradient | CanvasPattern {
    return this.#ctx.fillStyle
  }

  set fillStyle (value : string | CanvasGradient | CanvasPattern) {
    this.#ctx.fillStyle = value
  }

  get strokeStyle (): string | CanvasGradient | CanvasPattern {
    return this.#ctx.strokeStyle
  }

  set strokeStyle (value : string | CanvasGradient | CanvasPattern) {
    this.#ctx.strokeStyle = value
  }

  drawImage (src: CanvasImageSource, x: number, y: number, w?: number, h?: number, sx?: number, sy?: number, sw?: number, sh?: number) {
    if (typeof w === 'number' && typeof h === 'number' && typeof sx === 'number' && typeof sy === 'number' && typeof sw === 'number' && typeof sh === 'number')
      this.#ctx.drawImage(src, x, y, w, h, sx, sy, sw, sh)
    else
      this.#ctx.drawImage(src, x, y)
  }
    
}