export type TPoint = { x: number, y: number }

export class FPoint {
  protected _x: number
  protected _y: number

  constructor (x: number, y: number) {
    this._x = x
    this._y = y
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

  static get zero () { return new Point(0, 0) }
}

export class Point extends FPoint {
  constructor (x: number, y: number) {
    super(0 | x, 0 | y)
  }

  get x () { return this._x }
  set x (value: number) { this._x = 0 | value }
  get y () { return this._y }
  set y (value: number) { this._y = 0 | value }

  scale(dx: number, dy: number) {
    return new Point(0 | this.x * dx, 0 | this.y * dy)
  }

  scaleSelf (dx: number, dy: number) {
    this.x = 0 | this.x * dx
    this.y = 0 | this.y * dy
    return this
  }

  scaleX(dx: number) {
    return new Point(0 | this.x * dx, this.y)
  }

  scaleY(dy: number) {
    return new Point(this.x, 0 | this.y * dy)
  }
}