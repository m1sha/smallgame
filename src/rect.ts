import { absPoint, copyPoint, isTPoint, Point, setPoint, subPoints, TPoint, zeroPoint } from "./point"
import { Sprite } from "./sprite"
import { Pivote } from './pivote'

export type TRect = { x: number, y: number, width: number, height: number }

export interface MutableRect {
  x: number
  y: number
  width: number 
  height: number
  readonly topLeft: TPoint
  readonly topRight: TPoint
  readonly bottomLeft: TPoint
  get center(): TPoint
  set center(value: TPoint)
  readonly absCenter: TPoint
  readonly absWidth: number
  readonly diagonal: number
  get points(): [TPoint, TPoint, TPoint, TPoint]
  overlaps (rect: MutableRect): boolean
  touchSide (rect: MutableRect): ('left' | 'right' | 'top' | 'bottom')[]
  inside (rect: TRect): boolean
  contains (rect: MutableRect): boolean
  containsPoint({x, y}: TPoint): boolean 
  equals(rect: MutableRect | TRect): boolean
  outline (padding: number): MutableRect
  outline (top: number, left: number, bottom: number, right: number): MutableRect
  outline (...args: Array<any>): MutableRect
  clone (): MutableRect
  move (point: TPoint, pivote?: Pivote): MutableRect
  move (x: number, y: number, pivote?: Pivote): MutableRect
  move (...args: Array<any>): MutableRect
  moveSelf (point: TPoint, pivote?: Pivote): MutableRect
  moveSelf (x: number, y: number, pivote?: Pivote): MutableRect
  moveSelf (...args: Array<any>): MutableRect
  resize (width: number, height: number): MutableRect
  resizeSelf (width: number, height: number): MutableRect
  union (rect: MutableRect): MutableRect
  unionSelf (rect: MutableRect): MutableRect
  rotate (a: number, pivot?: number | TPoint): PolyRect
}

export class Rect implements MutableRect {
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

  get topLeft () { 
    return { x: this.x, y: this.y }
  }

  set topLeft (value: TPoint) {
    this.x = this.x
    this.y = this.y
  }

  get topRight () { 
    return { x: this.absWidth, y: this.y }
  }

  set topRight (value: TPoint) {
    this.width = value.x - this.x
    this.y = this.y
  }

  get bottomLeft () { 
    return { x: this.x, y: this.absHeight }
  }

  set bottomLeft (value: TPoint) {
    this.x = this.x
    this.height = value.y - this.y
  }

  get bottomRight () { 
    return { x: this.absWidth, y: this.absHeight }
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

  get center (): TPoint {
    return { x: this.width / 2, y: this.height / 2 }
  }

  set center (value: TPoint) {
    this.moveSelf(value, 'center-center')
  }

  get absCenter () {
    const { x, y } = this.center
    return { x: this.x + x, y: this.y + y }
  }

  get diagonal () { return Math.sqrt(this.width * this.width + this.height * this.height) }

  get points (): [TPoint, TPoint, TPoint, TPoint] {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft]
  }

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

  containsPoint({x, y}: TPoint) {
    return x >= this.x && x <= this.absWidth &&  y>= this.y && y <= this.absHeight
  }

  equals(rect: Rect | TRect) {
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

  resize (width: number, height: number) {
    return new Rect(this.x, this.y, width, height)
  }

  resizeSelf (width: number, height: number) {
    this.width = width
    this.height = height
    return this
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

  static size (width: number, height: number) {
    return new Rect(0, 0, width, height)
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

export class ObservableRect implements MutableRect /* implicitly implements Observable */ {
  /** @internal */ protected /*Observable.*/callback: ((sprite: Sprite) => void) | null = null
  #sprite: Sprite

  #rect: Rect
  constructor (sprite: Sprite, x: number, y: number, width: number, height: number) {
    this.#sprite = sprite
    this.#rect = new Rect(x, y, width, height)
  }

  get x() { return this.#rect.x }
  set x(value: number) { 
    this.#rect.x = value
    if (this.callback) this.callback(this.#sprite)
  }

  get y() { return this.#rect.y }
  set y(value: number) { 
    this.#rect.y = value
    if (this.callback) this.callback(this.#sprite)
  }

  get width() { return this.#rect.width }
  set width(value: number) { 
    this.#rect.width = value
    if (this.callback) this.callback(this.#sprite)
  }

  get height() { return this.#rect.height }
  set height(value: number) { 
    this.#rect.height = value
    if (this.callback) this.callback(this.#sprite)
  }
  get center () { return this.#rect.center }
  set center (value: TPoint) { this.#rect.center = value }
  get absCenter () { return this.#rect.absCenter }
  get absWidth () { return this.#rect.absWidth }
  get absHeight () { return this.#rect.absHeight }
  get topLeft () { return this.#rect.topLeft }
  set topLeft (value: TPoint) { this.#rect.topLeft = value }
  get topRight () { return this.#rect.topRight }
  set topRight (value: TPoint) { this.#rect.topRight = value }
  get bottomLeft () { return this.#rect.bottomLeft }
  set bottomLeft (value: TPoint) { this.#rect.bottomLeft = value }
  get bottomRight () { return this.#rect.bottomRight }
  set bottomRight (value: TPoint) { this.#rect.bottomRight = value }
  get diagonal () { return this.#rect.diagonal }
  get points (): [TPoint, TPoint, TPoint, TPoint] { return this.#rect.points }
  overlaps (rect: Rect) { return this.#rect.overlaps(rect) }
  touchSide (rect: TRect) { return this.#rect.touchSide(rect) }
  inside (rect: TRect): boolean { return this.#rect.inside(rect) }
  contains (rect: Rect) { return this.#rect.contains(rect) }
  containsPoint (point: TPoint) { return this.#rect.containsPoint(point) }
  equals (rect: Rect) { return this.#rect.equals(rect) }
  outline (padding: number): Rect
  outline (top: number, left: number, bottom: number, right: number): Rect
  outline (...args: Array<any>): Rect { 
    return this.#rect.outline.apply(this.#rect, args as any)
  }
  clone () { return this.#rect.clone() }
  move (point: TPoint, pivote?: Pivote): Rect
  move (x: number, y: number, pivote?: Pivote): Rect
  move (...args: Array<any>): Rect {
    return this.#rect.move.apply(this.#rect, args as any)
  }
  moveSelf (point: TPoint, pivote?: Pivote): Rect
  moveSelf (x: number, y: number, pivote?: Pivote): Rect
  moveSelf (...args: Array<any>): Rect {
    return this.#rect.moveSelf.apply(this.#rect, args as any)
  }
  resize (width: number, height: number) {
    return this.#rect.resize(width, height)
  }
  resizeSelf (width: number, height: number) {
    return this.#rect.resizeSelf(width, height)
  }
  union (rect: TRect) {
    return this.#rect.union(rect)
  }
  unionSelf (rect: TRect) {
    return this.#rect.unionSelf(rect)
  }
  rotate (a: number, pivot?: number | TPoint) {
    return this.#rect.rotate(a, pivot)
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

