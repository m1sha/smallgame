import { TSize } from "./size"
import { rad } from "./utils"

export type TPoint = { x: number, y: number }

export class Point {
  // protected _x: number = 0
  // protected _y: number = 0
  private xy = new Float32Array(2)

  constructor (point: TPoint)
  constructor (x: number, y: number)
  constructor (...args: Array<any>) {
    if (typeof args[0] === 'number' && typeof args[1] === 'number' ) {
      this.xy[0] = args[0]
      this.xy[1] = args[1]
      return
    } 
    else if (typeof args[0] === 'object' && typeof args[0].x === 'number' && typeof args[0].y === 'number' ) {
      this.xy[0] = args[0].x
      this.xy[1] = args[0].y
      return
    }

    throw new Error('unsupported arguments.')
  }

  get x (): number { return this.xy[0] }
  
  set x (value: number) { this.xy[0] = value }
  
  get y (): number { return this.xy[1] }
  
  set y (value: number) { this.xy[1] = value }

  get magnitude () {
    return Math.sqrt(this.dot(this))
  }

  get length () {
    return this.magnitude
  }

  get magnitudeSq () {
    return this.dot(this)
  }

  move (value: number): Point 
  move (point: TPoint): Point 
  move (x: number, y: number): Point
  move (...args: Array<any>): Point {
    if (args.length === 1 && typeof args[0] === 'number') {
      return new Point(args[0], args[0])  
    }

    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Point(args[0], args[1]) 
    }

    if (typeof args[0] === 'object' && args[0] && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      return new Point(args[0].x, args[0].y)
    }

    throw new Error('unsupported arguments.')
  }

  moveSelf (value: number): Point 
  moveSelf (point: TPoint): Point 
  moveSelf (x: number, y: number): Point
  moveSelf  (...args: Array<any>): Point {
    if (args.length === 1 && typeof args[0] === 'number') {
      this.x = args[0]
      this.y = args[0]
      return this
    }

    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.x = args[0]
      this.y = args[1]
      return this
    }

    if (typeof args[0] === 'object' && args[0] && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      this.x = args[0].x
      this.y = args[0].y
      return this
    }

    throw new Error('unsupported arguments.')
  }

  moveX (x: number): Point {
    return new Point(x, this.y)
  }

  moveY (y: number): Point {
    return new Point(this.x, y)
  }

  moveXSelf (x: number): Point {
    this.x = x
    return this
  }

  moveYSelf (y: number): Point {
    this.y = y
    return this
  }

  shift (d: number): Point 
  shift (dp: TPoint): Point 
  shift (dx: number, dy: number): Point
  shift (...args: Array<any>): Point {
    if (args.length === 1 && typeof args[0] === 'number' ) {
      return new Point(this.x + args[0], this.y + args[0])
    }

    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Point(this.x + args[0], this.y + args[1])
    }

    if (typeof args[0] === 'object' && args[0] && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      return new Point(this.x + args[0].x, this.y + args[0].y)
    }

    throw new Error('unsupported arguments.')
  }

  shiftSelf (d: number): Point 
  shiftSelf (dp: TPoint): Point 
  shiftSelf (dx: number, dy: number): Point 
  shiftSelf (...args: Array<any>): Point {
    if (args.length === 1 && typeof args[0] === 'number' ) {
      this.x += args[0]
      this.y += args[0]
      return this
    }

    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.x += args[0]
      this.y += args[1]
      return this
    }

    if (typeof args[0] === 'object' && args[0] && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      this.x += args[0].x
      this.y += args[0].y
      return this
    }
    
    throw new Error('unsupported arguments.')
  }

  shiftX (dx: number): Point {
    return new Point(this.x + dx, this.y)
  }

  shiftY (dy: number): Point {
    return new Point(this.x, this.y + dy)
  }

  shiftXSelf (dx: number): Point {
    this.x += dx
    return this
  }

  shiftYSelf (dy: number): Point {
    this.y += dy
    return this
  }

  
  diff (d: number): Point 
  diff (dp: TPoint): Point 
  diff (dx: number, dy: number): Point
  diff (...args: Array<any>): Point {
    if (args.length === 1 && typeof args[0] === 'number' ){
      return new Point(this.x - args[0], this.y - args[0])
    }

    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Point(this.x - args[0], this.y - args[1])
    }

    if (typeof args[0] === 'object' && args[0] && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      return new Point(this.x - args[0].x, this.y - args[0].y)
    }
    
    throw new Error('unsupported arguments.')

  }

  scale (d: number): Point 
  scale (dp: TPoint): Point 
  scale (dx: number, dy: number): Point
  scale (...args: Array<any>): Point {
    if (args.length === 1 && typeof args[0] === 'number' ){
      return new Point(this.x * args[0], this.y * args[0])
    }

    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Point(this.x * args[0], this.y * args[1])
    }

    if (typeof args[0] === 'object' && args[0] && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      return new Point(this.x * args[0].x, this.y * args[0].y)
    }
    
    throw new Error('unsupported arguments.')
    
  }

  scaleSelf (d: number): Point 
  scaleSelf (dp: TPoint): Point 
  scaleSelf (dx: number, dy: number): Point
  scaleSelf (...args: Array<any>): Point {
    if (args.length === 1 && typeof args[0] === 'number' ){
      this.x *= args[0]
      this.y *= args[0]
      return this
    }

    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.x *= args[0]
      this.y *= args[1]
      return this
    }

    if (typeof args[0] === 'object' && args[0] && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      this.x *= args[0].x
      this.y *= args[0].y
      return this
    }
    
    throw new Error('unsupported arguments.')
  }

  scaleX (dx: number): Point {
    return new Point(this.x * dx, this.y)
  }

  scaleY (dy: number): Point {
    return new Point(this.x, this.y * dy)
  }

  scaleXSelft (dx: number): Point {
    this.x *= dx
    return this
  }

  scaleYSelft (dy: number): Point {
    this.y *= dy
    return this
  }

  dot (p: TPoint) {
   return this.x * p.x + this.y * p.y
  }

  cross (p: TPoint) {
   return this.x * p.y - this.y * p.x
  }

  rotate (deg: number): Point {
    const a = rad(deg)
    return new Point(this.x + Math.cos(a), this.y + Math.sin(a))
  }

  rotateSelf (deg: number): Point {
    const a = rad(deg)
    this.shiftSelf(Math.cos(a), Math.sin(a))
    return this
  }

  neg (): Point {
    return new Point(-this.x, -this.y)
  }

  negX (): Point {
    return new Point(-this.x, this.y)
  }

  negY (): Point {
    return new Point(this.x, -this.y)
  }

  negSelf (): Point {
    this.x *= -1
    this.y *= -1
    return this
  }

  negXSelf (): Point {
    this.x *= -1
    return this
  }

  negYSelf (): Point {
    this.y *= -1
    return this
  }

  negative (): Point { return this.neg() }
  negativeX (): Point { return this.negX() }
  negativeY (): Point { return this.negY() }
  negativeSelf (): Point { return this.negSelf() }
  negativeXSelf (): Point { return this.negXSelf() }
  negativeYSelf (): Point { return this.negYSelf() }

  arr (): [number, number] {
    return [this.x, this.y]
  }

  abs (): Point {
    return new Point(Math.abs(this.x), Math.abs(this.y))
  }

  absSelf (): Point {
    this.x = Math.abs(this.x) 
    this.y = Math.abs(this.y)
    return this
  }

  int (): Point {
    return new Point(0 | this.x, 0 | this.y)
  }

  intSelf (): Point {
    this.x = 0 | this.x
    this.y = 0 | this.y
    return this
  }

  uv (size: TSize): Point
  uv (width: number, height: number): Point
  uv (...args: Array<any>): Point {
    let w = 0, h = 0
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      w = args[0]; h = args[1];
    }
    if (args.length === 1 && args[0] && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      w = args[0].width; h = args[0].height;
    }
    if (!w || !h) throw new Error('Incorrect size or unsupported arguments.')
    
    return new Point(this.x / w, 1 - this.y / h)
  }

  uvSelf (size: TSize): Point
  uvSelf (width: number, height: number): Point
  uvSelf (...args: Array<any>): Point {
    let w = 0, h = 0
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      w = args[0]; h = args[1];
    }
    if (args.length === 1 && args[0] && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      w = args[0].width; h = args[0].height;
    }
    if (!w || !h) throw new Error('Incorrect size or unsupported arguments.')
    
    this.x = this.x / w
    this.y = 1 - this.y / h
    return this
  }

  math (size: TSize): Point
  math (width: number, height: number): Point
  math (...args: Array<any>): Point {
    let w = 0, h = 0
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      w = args[0]; h = args[1];
    }
    if (args.length === 1 && args[0] && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      w = args[0].width; h = args[0].height;
    }
    if (!w || !h) throw new Error('Incorrect size or unsupported arguments.')
    
    return new Point((this.x / w) * 2 - 1,  (this.y / h) * -2 + 1)
  }

  mathSelf (size: TSize): Point
  mathSelf (width: number, height: number): Point
  mathSelf (...args: Array<any>): Point {
    let w = 0, h = 0
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      w = args[0]; h = args[1];
    }
    if (args.length === 1 && args[0] && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      w = args[0].width; h = args[0].height;
    }
    if (!w || !h) throw new Error('Incorrect size or unsupported arguments.')

    this.x = (this.x / w) * 2 - 1
    this.y = (this.y / h) * -2 + 1
    return this
  }

  screen (size: TSize, from: 'uv' | 'math'): Point
  screen (width: number, height: number, from: 'uv' | 'math'): Point
  screen (...args: Array<any>): Point {
    let w = 0, h = 0, from = ''
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      w = args[0]; h = args[1]; from = args[3]
    }
    if (args.length === 2 && args[0] && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      w = args[0].width; h = args[0].height; from = args[1]
    }
    if (!w || !h || !from) throw new Error('Incorrect size or unsupported arguments.')
   
    return from === 'math' ? new Point(((this.x + 1) / 2) * w, ((1 - this.y) / 2) * h) : new Point(this.x * w, (1 - this.y)*h)
  }

  screenSelf (size: TSize, from: 'uv' | 'math'): Point
  screenSelf (width: number, height: number, from: 'uv' | 'math'): Point
  screenSelf (...args: Array<any>): Point {
    let w = 0, h = 0, from = ''
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      w = args[0]; h = args[1]; from = args[3]
    }
    if (args.length === 2 && args[0] && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      w = args[0].width; h = args[0].height; from = args[0].from
    }
    if (!w || !h || !from) throw new Error('Incorrect size or unsupported arguments.')
   
    if (from === 'math') {
      this.x = ((this.x + 1) / 2) * w
      this.y = ((1 - this.y) / 2) * h
    } else {
      this.x = this.x * w
      this.y = (1 - this.y)*h
    } 

    return this
  }

  equals (point: TPoint): boolean {
    return this === point || (point.x === this.x && point.y === this.y)
  }

  swapAxis () {
    return new Point(this.y, this.x)
  }

  swapAxisSelf () {
    const x = this.x
    this.x = this.y
    this.y = x
    return this
  }

  clone () {
    return new Point(this.xy[0], this.xy[1])
  }

  static get zero (): Point { return new Point(0, 0) }
  
  static get one (): Point { return new Point(1, 1) }

  static distance (p0: TPoint, p1: TPoint): number {
    const dx = Math.pow(p1.x - p0.x, 2)
    const dy = Math.pow(p1.y - p0.y, 2)
    return Math.sqrt(dx + dy)
  }

  static inCircle(p0: TPoint, p1: TPoint, r: number) {
    const dx = Math.pow(p1.x - p0.x, 2)
    const dy = Math.pow(p1.y - p0.y, 2)
    return (dx + dy) < r * r
  }

  static middle(p0: TPoint, p1: TPoint): TPoint {
    return { x: (p0.x + p1.x) / 2 , y: (p0.y + p1.y) / 2 }
  }

  static from (point: TPoint) {
    return new Point(point)
  }
}


export function isTPoint (value: any) {
  const point = value as TPoint
  return point && typeof point.x === 'number' && typeof point.y === 'number'
}

export function copyPoint (a: TPoint, b: TPoint, type: 'default' | 'int' = 'default') {
  a.x = type === 'int' ? 0 | b.x : b.x
  a.y = type === 'int' ? 0 | b.y : b.y
}

export function zeroPoint (): TPoint {
  return { x: 0, y: 0 }
}

export function absPoint (point: TPoint): TPoint {
  return { x: Math.abs(point.x), y: Math.abs(point.y) }
}

export function negativePoint (point: TPoint): TPoint {
  return { x: -point.x, y: -point.y }
}

export function setPoint (x: number, y: number): TPoint {
  return { x, y }
}

export function resetPoint (point: TPoint, x: number, y: number): void {
  point.x = x
  point.y = y
}

export function mulPoints (p0: TPoint, p1: TPoint): TPoint {
  return { x: p0.x * p1.x, y: p0.y * p1.y }
}

export function divPoints (p0: TPoint, p1: TPoint): TPoint {
  return { x: p0.x / p1.x, y: p0.y / p1.y }
}

export function sumPoints (p0: TPoint, p1: TPoint): TPoint {
  return { x: p0.x + p1.x, y: p0.y + p1.y }
}

export function subPoints (p0: TPoint, p1: TPoint): TPoint {
  return { x: p0.x - p1.x, y: p0.y - p1.y }
}

export function gl_normalize({ x, y }: TPoint, w: number, h: number) {
  return setPoint (x / (w * 0.5)  -  1.0, 1.0 - y / (h * 0.5))
}