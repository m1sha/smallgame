import { TPoint } from "point"
import { Sprite } from "./sprite"

export type Pivote = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'center-center'

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

  get topLeft () { 
    return { x: this.x, y: this.y}
  }

  get topRight () { 
    return { x: this.absWidth, y: this.y}
  }

  get bottomLeft () { 
    return { x: this.x, y: this.absHeight}
  }

  get bottomRight () { 
    return { x: this.absWidth, y: this.absHeight }
  }

  get absWidth () {
    return this.x + this.width
  }

  get absHeight () {
    return this.y + this.height
  }

  get center () {
    return { x: this.width / 2, y: this.height / 2 }
  }

  get absCenter () {
    const { x, y } = this.center
    return { x: this.x + x, y: this.y + y }
  }

  get diagonal () { return Math.sqrt(this.width * this.width + this.height * this.height) }

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

  touchSide (rect: Rect): ('left' | 'right' | 'top' | 'bottom')[] {
    const result: ('left' | 'right' | 'top' | 'bottom')[] = new Array(2)
    const { x, y } = this.absCenter
    if (x > rect.x) result[0] = 'right'
    if (x < rect.x) result[0] = 'left'
    if (y < rect.y) result[1] = 'bottom'
    if (y > rect.y) result[1] = 'top'
    return result
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

  resize (width: number, height: number) {
    return new Rect(this.x, this.y, width, height)
  }

  resizeSelf (width: number, height: number) {
    this.width = width
    this.height = height
    return this
  }

  static get zero () {
    return new Rect(0, 0, 0, 0)
  }

  static size (width: number, height: number) {
    return new Rect(0, 0, width, height)
  }

  private calcPivote(pivote?: Pivote) {
    if (!pivote) return [0, 0]
    switch (pivote) {
      case 'top-left': return [0, 0]
      case 'top-right': return [-this.width, 0]
      case 'bottom-left': return [0, -this.height]
      case 'bottom-right': return [-this.width, -this.height]
      case 'center-center': return [0 | -this.width / 2, 0 | -this.height  / 2]
      default: return [0, 0]
    }
  }
}

export class ObservableRect /* implicitly implements Observable */ {
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
  get absCenter () { return this.#rect.absCenter }
  get absWidth () { return this.#rect.absWidth }
  get absHeight () { return this.#rect.absHeight }
  get topLeft () { return this.#rect.topLeft }
  get topRight () { return this.#rect.topRight }
  get bottomLeft () { return this.#rect.bottomLeft }
  get bottomRight () { return this.#rect.bottomRight }
  get diagonal () { return this.#rect.diagonal }
  overlaps (rect: Rect) { return this.#rect.overlaps(rect) }
  touchSide (rect: Rect) { return this.#rect.touchSide(rect) }
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
}