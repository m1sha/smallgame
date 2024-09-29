export type TPoint = { x: number, y: number }

export class Point {
  protected _x: number = 0
  protected _y: number = 0

  constructor (point: TPoint)
  constructor (x: number, y: number)
  constructor (...args: Array<any>) {
    if (typeof args[0] === 'number' && typeof args[1] === 'number' ) {
      this._x = args[0]
      this._y = args[1]
    } 
    else if (typeof args[0] === 'object' && Object.hasOwn(args[0], 'x') && Object.hasOwn(args[0], 'y') ) {
      this._x = args[0].x
      this._y = args[0].y
    }
  }

  get x () { return this._x }
  
  set x (value: number) { this._x = value }
  
  get y () { return this._y }
  
  set y (value: number) { this._y = value }

  move (x: number, y: number) {
    return new Point(x, y)
  }

  moveSelf (x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  moveX (x: number) {
    return new Point(x, this.y)
  }

  moveY (y: number) {
    return new Point(this.x, y)
  }

  shift (dx: number, dy: number) {
    return new Point(this.x + dx, this.y + dy)
  }

  shiftSelf (dx: number, dy: number) {
    this.x += dx
    this.y += dy
    return this
  }

  shiftX (dx: number) {
    return new Point(this.x + dx, this.y)
  }

  shiftY (dy: number) {
    return new Point(this.x, this.y + dy)
  }

  scale(dx: number, dy: number) {
    return new Point(this.x * dx, this.y * dy)
  }

  scaleSelf (dx: number, dy: number) {
    this.x = this.x * dx
    this.y = this.y * dy
    return this
  }

  scaleX(dx: number) {
    return new Point(this.x * dx, this.y)
  }

  scaleY(dy: number) {
    return new Point(this.x, this.y * dy)
  }

  negative () {
    return new Point(-this.x, -this.y)
  }

  negativeSelf () {
    this.x *= -1
    this.y *= -1
    return this
  }

  static get zero () { return new Point(0, 0) }

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
