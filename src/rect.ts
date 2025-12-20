import { absPoint, copyPoint, isTPoint, Point, setPoint, subPoints, type TPoint, zeroPoint } from "./point"
import { type Pivote } from './pivote'
import { type TSize } from "./size"

export type TRect = { x: number, y: number, width: number, height: number }

export class Rect {
  x: number
  y: number
  width: number
  height: number

  constructor (x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  get topLeft (): Point { 
    return new Point(this.x, this.y)
  }

  set topLeft (value: TPoint) {
    this.x = value.x
    this.y = value.y
  }

  get topRight (): Point { 
    return new Point (this.absWidth, this.y)
  }

  set topRight (value: TPoint) {
    this.width = value.x - this.x
    this.y = this.y
  }

  get bottomLeft (): Point { 
    return new Point(this.x, this.absHeight)
  }

  set bottomLeft (value: TPoint) {
    this.x = this.x
    this.height = value.y - this.y
  }

  get bottomRight (): Point { 
    return new Point(this.absWidth, this.absHeight)
  }

  set bottomRight (value: TPoint) {
    this.width = value.x - this.x
    this.height = value.y - this.y
  }

  get absWidth () {
    return this.x + this.width
  }

  get absHeight () {
    return this.y + this.height
  }

  get center (): Point {
    return new Point(this.width / 2, this.height / 2)
  }

  set center (value: TPoint) {
    this.moveSelf(value, 'center-center')
  }

  get absCenter (): Point {
    const { x, y } = this.center
    return new Point(this.x + x, this.y + y)
  }

  set absCenter (value: TPoint) {
    const { x, y } = this.center
    this.x = value.x - x
    this.y = value.y - y
  }


  get diagonal () { return Math.sqrt(this.width * this.width + this.height * this.height) }

  get points (): [TPoint, TPoint, TPoint, TPoint] {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft]
  }

  get ratio () { return this.width / this.height }

  overlaps (rect: Rect) {
    const e1 =  this.containsPoint(rect.topLeft) 
    const e2 =  this.containsPoint(rect.topRight) 
    const e3 =  this.containsPoint(rect.bottomLeft) 
    const e4 =  this.containsPoint(rect.bottomRight)

    const e5 =  rect.containsPoint(this.topLeft) 
    const e6 =  rect.containsPoint(this.topRight) 
    const e7 =  rect.containsPoint(this.bottomLeft) 
    const e8 =  rect.containsPoint(this.bottomRight)
    return e1 || e2 || e3 || e4 || e5 || e6 || e7 || e8
  }

  touchSide (rect: TRect): ('left' | 'right' | 'top' | 'bottom')[] {
    const result: ('left' | 'right' | 'top' | 'bottom')[] = new Array(2)
    const { x, y } = this.absCenter
    if (x > rect.x) result[0] = 'right'
    if (x < rect.x) result[0] = 'left'
    if (y < rect.y) result[1] = 'bottom'
    if (y > rect.y) result[1] = 'top'
    return result
  }

  inside (rect: TRect): boolean {
    return rect.x <= this.x && rect.y <= this.y && (this.x + this.width) <= (rect.x + rect.width) && (this.y + this.height) <= (rect.y + rect.height)
  }

  contains (rect: Rect) {
    return ((rect.x >= this.x && rect.x <= this.absWidth) && (rect.y >= this.y && rect.y <= this.absHeight)) ||
    ((this.x >= rect.x && this.x <= rect.absWidth) && (this.y >= rect.y && this.y <= rect.absHeight))
  }

  containsPoint ({x, y}: TPoint) {
    return x >= this.x && x <= this.absWidth &&  y>= this.y && y <= this.absHeight
  }

  equals (rect: Rect | TRect) {
    if (this === rect) return true
    return this.x == rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height
  }

  outline (padding: number): Rect
  outline (top: number, left: number, bottom: number, right: number): Rect
  outline (...args: Array<any>): Rect {
    if (args.length === 4 && !args.some(p => typeof p !== 'number')) {
      const [top, left, bottom, right] = args
      return new Rect(this.x + left, this.y + top, this.width - right - left, this.height - bottom - top)
    } else
    if (typeof args[0] === 'number') {
      const padding = args[0]
      return new Rect(this.x + padding, this.y + padding, this.width - padding - padding, this.height - padding - padding)
    } else {
      const { top, left, bottom, right } = args[0]
      return new Rect(this.x + left, this.y + top, this.width - right - left, this.height - bottom - top)
    }
  }

  clone () {
    return new Rect(this.x, this.y, this.width, this.height)
  }

  move (point: TPoint, pivote?: Pivote): Rect
  move (x: number, y: number, pivote?: Pivote): Rect
  move (...args: Array<any>): Rect {
    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      const [x, y] = this.calcPivote(args[2])
      return new Rect(args[0] + x, args[1] + y, this.width, this.height)
    }
    else {
      const point = args[0] as TPoint
      const [x, y] = this.calcPivote(args[1])
      if (point && typeof point.x === 'number' && typeof point.y === 'number')
        return new Rect(point.x + x, point.y + y, this.width, this.height)
      else
        throw new Error('Unsupport arguments.')
    }
    
  }

  moveSelf (point: TPoint, pivote?: Pivote): Rect
  moveSelf (x: number, y: number, pivote?: Pivote): Rect
  moveSelf (...args: Array<any>): Rect  {
    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      const [x, y] = this.calcPivote(args[2])
      this.x = args[0] + x
      this.y = args[1] + y
      return this
    } else {
      const point = args[0] as TPoint
      const [x, y] = this.calcPivote(args[1])
      if (point && typeof point.x === 'number' && typeof point.y === 'number') {
        this.x = point.x + x
        this.y = point.y + y
        return this
      }
    }
    throw new Error('Unsupport arguments.')
  }

  shift (point: TPoint, pivote?: Pivote): Rect
  shift (x: number, y: number, pivote?: Pivote): Rect
  shift (...args: Array<any>): Rect  {
    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      const [x, y] = this.calcPivote(args[2])
      return new Rect(this.x + args[0] + x,  this.y + args[1] + y, this.width, this.height)
    } else {
      const point = args[0] as TPoint
      const [x, y] = this.calcPivote(args[1])
      if (point && typeof point.x === 'number' && typeof point.y === 'number') {
        return new Rect(this.x + point.x + x, this.y + point.y + y, this.width, this.height)
      }
    }
    throw new Error('Unsupport arguments.')
  }

  shiftSelf (point: TPoint, pivote?: Pivote): Rect
  shiftSelf (x: number, y: number, pivote?: Pivote): Rect
  shiftSelf (...args: Array<any>): Rect  {
    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      const [x, y] = this.calcPivote(args[2])
      this.x += args[0] + x
      this.y += args[1] + y
      return this
    } else {
      const point = args[0] as TPoint
      const [x, y] = this.calcPivote(args[1])
      if (point && typeof point.x === 'number' && typeof point.y === 'number') {
        this.x += point.x + x
        this.y += point.y + y
        return this
      }
    }
    throw new Error('Unsupport arguments.')
  }
  
  resize (size: TSize): Rect
  resize (width: number, height: number): Rect
  resize (value: number): Rect
  resize (...args: Array<any>): Rect {
    if (args.length === 1 && typeof args[0] === 'number') {
      return new Rect(this.x, this.y, args[0], args[0])
    }

    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Rect(this.x, this.y, args[0], args[1])
    }

    if (args.length === 1 && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      return new Rect(this.x, this.y, args[0].width, args[0].height)
    }

    throw new Error('Unsupport arguments.')
  }

  resizeSelf (size: TSize): Rect
  resizeSelf (width: number, height: number): Rect
  resizeSelf (value: number): Rect
  resizeSelf (...args: Array<any>): Rect {
    if (args.length === 1 && typeof args[0] === 'number') {
      this.width = args[0]
      this.height = args[0]
      return this
    }

    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.width = args[0]
      this.height = args[1]
      return this
    }

    if (args.length === 1 && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      this.width = args[0].width
      this.height = args[0].height
      return this
    }
    
    throw new Error('Unsupport arguments.')
  }

  scalesize (dw: number, dh: number): Rect
  scalesize (size: TSize): Rect
  scalesize (value: number): Rect
  scalesize (...args: Array<any>): Rect {
    if (args.length === 1 && typeof args[0] === 'number') {
      return new Rect(this.x, this.y, this.width * args[0], this.height * args[0])  
    }

    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Rect(this.x, this.y, this.width * args[0], this.height * args[1])  
    }

    if (args.length === 1 && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      return new Rect(this.x, this.y, this.width * args[0].width, this.height * args[0].height)  
    }

    throw new Error('Unsupport arguments.')
  }

  scalesizeSelf (dw: number, dh: number): Rect
  scalesizeSelf (size: TSize): Rect
  scalesizeSelf (value: number): Rect
  scalesizeSelf (...args: Array<any>): Rect {
    if (args.length === 1 && typeof args[0] === 'number') {
      this.width *= args[0]
      this.height *= args[0]
      return this
    }

    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.width *= args[0]
      this.height *= args[1]
      return this
    }

    if (args.length === 1 && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      this.width *= args[0].width
      this.height *= args[0].height
      return this
    }

    throw new Error('Unsupport arguments.')
  }

  scale (dw: number, dh: number): Rect
  scale (value: number): Rect
  scale (...args: Array<any>): Rect {
    if (args.length === 1 && typeof args[0] === 'number') {
      return new Rect(this.x * args[0], this.y * args[0], this.width * args[0], this.height * args[0])
    }
    
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Rect(this.x * args[0], this.y * args[1], this.width * args[0], this.height * args[1])
    }

    throw new Error('Unsupport arguments.')
  }

  scaleSelf (dw: number, dh: number): Rect
  scaleSelf (value: number): Rect
  scaleSelf (...args: Array<any>): Rect {
    if (args.length === 1 && typeof args[0] === 'number') {
      this.x *= args[0]
      this.y *= args[0]
      this.width *= args[0]
      this.height *= args[0]
      return this
    }

    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.x *= args[0]
      this.y *= args[1]
      this.width *= args[0]
      this.height *= args[1]
      return this
    }
    throw new Error('Unsupport arguments.')
  }

  union (rect: TRect) {
    return Rect.fromTwoPoints(
      new Point(Math.min(this.x, rect.x), Math.min(this.y, rect.y) ), 
      new Point(Math.max(this.absWidth, rect.width + rect.x), Math.max(this.absHeight, rect.height + rect.y))
    )
  }

  unionSelf (rect: TRect) {
    this.topLeft = new Point(Math.min(this.x, rect.x), Math.min(this.y, rect.y) )
    this.bottomRight = new Point(Math.max(this.absWidth, rect.width + rect.x), Math.max(this.absHeight, rect.height + rect.y))
    return this
  }

  rotate (a: number, pivot?: number | TPoint) {
    const { x, y, width, height } = this
    return new PolyRect(x, y, width, height).rotateSelf(a, pivot as any)
  }

  static get zero () {
    return new Rect(0, 0, 0, 0)
  }

  static size (width: number, height: number): Rect
  static size (size: TSize): Rect
  static size (...args: Array<any>): Rect {
    if (args.length === 1 && args[0] && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      return new Rect(0, 0, args[0].width, args[0].height)
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Rect(0, 0, args[0], args[1])
    }
    throw new Error('Unsupport arguments.')
  }

  static from ({ x, y, width, height }: TRect) {
    return new Rect(x, y, width, height)
  }

  static fromTwoPoints (p0: TPoint, p1: TPoint) {
    const p = absPoint(subPoints(p1, p0))
    return new Rect(p0.x, p0.y, p.x, p.y)
  }

  static fromCenter (center: TPoint, width: number, height: number) {
    return new Rect(center.x - width * 0.5, center.y - height * 0.5, width, height)
  }

  static fromRatio (ratio: number, length: number, side: 'width' | 'height') {
    const w = side === 'width' ? length : length / ratio
    const h = side === 'height' ? length : length * ratio
    return new Rect(0, 0, w, h)
  }

  static merge (rects: TRect[]): Rect {
    if (!rects || rects.length === 0) throw new Error('Count of rects must be more than zero.')
    
    let x0 = Number.MAX_SAFE_INTEGER
    let y0 = Number.MAX_SAFE_INTEGER
    let x1 = Number.MIN_SAFE_INTEGER
    let y1 = Number.MIN_SAFE_INTEGER

    rects.forEach(rect => {
      if (rect.x < x0) x0 = rect.x
      if (rect.y < y0) y0 = rect.y
      if (x1 < rect.x + rect.width) x1 = rect.x + rect.width
      if (y1 < rect.y + rect.height) y1 = rect.y + rect.height
    })
    
    return Rect.fromTwoPoints(setPoint(x0, y0), setPoint(x1, y1))
  }

  static isRect (rect: unknown): boolean {
    if (!rect) return false
    const r = rect as TRect
    return typeof r.x === 'number' && typeof r.y === 'number' && typeof r.width === 'number' && typeof r.height === 'number'
  }

  private calcPivote(pivote?: Pivote) {
    if (!pivote) return [0, 0]
    switch (pivote) {
      case 'bottom-right': return [0, 0]
      case 'bottom-left': return [-this.width, 0]
      case 'top-right': return [0, -this.height]
      case 'top-left': return [-this.width, -this.height]
      case 'center-center': return [0 | -this.width / 2, 0 | -this.height  / 2]
      case 'top-center': return [0 | -this.width / 2, 0 | -this.height]
      case 'bottom-center': return [0 | -this.width / 2, 0]
      case 'right-center': return [0, 0 | -this.height  / 2]
      case 'left-center': return [-this.width, 0 | -this.height  / 2]
  
      default: return [0, 0]
    }
  }
}

export class PolyRect {
  #topLeft = zeroPoint()
  #topRight = zeroPoint()
  #bottomLeft = zeroPoint()
  #bottomRight = zeroPoint()

  constructor (topLeft: TPoint, topRight: TPoint, bottomLeft: TPoint, bottomRight: TPoint)
  constructor (x: number, y: number, width: number, height: number)
  constructor (...args: Array<any>) {
    if (typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number' && typeof args[3] === 'number') {
      this.#topLeft = setPoint(args[0], args[1])
      this.#topRight = setPoint(args[0] + args[2], args[1])
      this.#bottomRight = setPoint(args[0] + args[2], args[1] + args[3])
      this.#bottomLeft = setPoint(args[0], args[1] + args[3])
      return
    }
    if (isTPoint(args[0]) && isTPoint(args[1]) && isTPoint(args[2]) && isTPoint(args[3])) {
      copyPoint(this.#topLeft, args[0])
      copyPoint(this.#topRight, args[1])
      copyPoint(this.#bottomLeft, args[2])
      copyPoint(this.#bottomRight, args[3])
      return
    }
  }

  get x () {
    return this.#topLeft.x
  }

  set x (value: number) {
    this.moveSelf(value, 0)
  }

  get y () {
    return this.#topLeft.y
  }

  set y (value: number) {
    this.moveSelf(0, value)
  }

  get width () {
    return 0 | Point.distance(this.#topLeft, this.#topRight)
  }

  get height () {
    return  0 | Point.distance(this.#topLeft, this.#bottomLeft)
  }

  get topLeft () { 
    return this.#topLeft
  }

  get topRight () { 
    return this.#topRight
  }

  get bottomLeft () { 
    return this.#bottomLeft
  }

  get bottomRight () { 
    return this.#bottomRight
  }

  moveSelf (x: number, y: number): PolyRect
  moveSelf (point: TPoint): PolyRect
  moveSelf (...args: Array<any>): PolyRect {
    let x = 0
    let y = 0

    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      [x, y] = args
    } else if (isTPoint(args[1])) {
      ({x, y} = args[1])
    }
    
    const translate = (point: TPoint) => new DOMMatrix()
      .translate(0 | x, 0 | y)
      .transformPoint(point)
    
    let point = translate(this)
    copyPoint(this.#topLeft, point, 'int')
    point = translate(this.topRight)
    copyPoint(this.#topRight, point, 'int')
    point = translate(this.bottomRight)
    copyPoint(this.#bottomRight, point, 'int')
    point = translate(this.bottomLeft)
    copyPoint(this.#bottomLeft, point, 'int')

    return this 
  }

  rotateSelf (angle: number, point: TPoint): PolyRect
  rotateSelf (angle: number, pivote?: Pivote): PolyRect
  rotateSelf (...args: Array<any>): PolyRect {
    let x = 0
    let y = 0
    if (typeof args[0] !== 'number') throw new Error('excepted number value')
    const angle = args[0]

    if (isTPoint(args[1])) {
      ({x, y} = args[1])
    } else {
      [x, y] = this.calcPivote(this, args[1])
    }
    
    const rotate = (point: TPoint) => {
      return new DOMMatrix()
        .translate(0 | x, 0 | y)
        .rotate(angle)
        .translate(0 | -x, 0 | -y)
        .transformPoint(point)  
    }
    
    let point = rotate(this)
    copyPoint(this.#topLeft, point, 'int')
    point = rotate(this.topRight)
    copyPoint(this.#topRight, point, 'int')
    point = rotate(this.bottomRight)
    copyPoint(this.#bottomRight, point, 'int')
    point = rotate(this.bottomLeft)
    copyPoint(this.#bottomLeft, point, 'int')
    return this
  }

  private calcPivote({x, y, width, height }: TRect, pivote?: Pivote) {
    if (!pivote) return [x, y]
    switch (pivote) {
      case 'bottom-right': return [width + x, height + y]
      case 'bottom-left': return [x, height + y]
      case 'top-right': return [width + x, y]
      case 'top-left': return [x, y]
      case 'center-center': return [0 | width / 2 + x, 0 | height / 2 + y]
      case 'bottom-center': return [0 | width / 2 + x, 0 | height + y]
      case 'top-center': return [0 | width / 2 + x, y]
      case 'left-center': return [0 | x, 0 | height  / 2 + y]
      case 'right-center': return [0 | width + x, 0 | height  / 2 + y]
      default: return [x, y]
    }
  }

}

export function copyRect({ x, y, width, height }: TRect): TRect {
  return { x, y, width, height }
}

export function setRect( x: number, y: number, width: number, height: number): TRect {
  return { x, y, width, height }
}

export function resetRect(rect: TRect, x?: number, y?: number, width?: number, height?: number): void {
  if (typeof x === 'number') rect.x = x
  if (typeof y === 'number') rect.y = y
  if (typeof width === 'number') rect.width = width
  if (typeof height === 'number') rect.height = height 
}

