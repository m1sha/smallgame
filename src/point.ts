import { TSize } from "./size"
import { rad } from "./utils"

export type TPoint = { x: number, y: number }

/**
 * Represents a 2D point with x and y coordinates.
 * Provides various mathematical operations for point manipulation.
 * @class Point
 */
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

  /**
   * Gets the x-coordinate
   * @type {number}
   */
  get x (): number { return this.xy[0] }
  
  /**
   * Sets the x-coordinate
   * @type {number}
   */
  set x (value: number) { this.xy[0] = value }
  
  /**
   * Gets the y-coordinate
   * @type {number}
   */
  get y (): number { return this.xy[1] }
  
  /**
   * Sets the y-coordinate
   * @type {number}
   */
  set y (value: number) { this.xy[1] = value }

  /**
   * Gets the magnitude (length) of the point vector
   * @type {number}
   */
  get magnitude () {
    return Math.sqrt(this.dot(this))
  }

  /**
   * Gets the length of the point vector (alias for magnitude)
   * @type {number}
   */
  get length () {
    return this.magnitude
  }

  /**
   * Gets the squared magnitude of the point vector
   * @type {number}
   */
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

  /**
   * Creates a new point with modified x-coordinate
   * @param {number} x - New x-coordinate
   * @returns {Point} New point
   */
  moveX (x: number): Point {
    return new Point(x, this.y)
  }

  /**
   * Creates a new point with modified y-coordinate
   * @param {number} y - New y-coordinate
   * @returns {Point} New point
   */
  moveY (y: number): Point {
    return new Point(this.x, y)
  }

  /**
   * Modifies the x-coordinate of this point
   * @param {number} x - New x-coordinate
   * @returns {Point} This point (for chaining)
   */
  moveXSelf (x: number): Point {
    this.x = x
    return this
  }

  /**
   * Modifies the y-coordinate of this point
   * @param {number} y - New y-coordinate
   * @returns {Point} This point (for chaining)
   */
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

  /**
   * Creates a new point shifted by x
   * @param {number} dx - Value to add to x
   * @returns {Point} New shifted point
   */
  shiftX (dx: number): Point {
    return new Point(this.x + dx, this.y)
  }

   /**
   * Creates a new point shifted by y
   * @param {number} dy - Value to add to y
   * @returns {Point} New shifted point
   */
  shiftY (dy: number): Point {
    return new Point(this.x, this.y + dy)
  }

  /**
   * Shifts this point by x
   * @param {number} dx - Value to add to x
   * @returns {Point} This point (for chaining)
   */
  shiftXSelf (dx: number): Point {
    this.x += dx
    return this
  }

  /**
   * Shifts this point by y
   * @param {number} dy - Value to add to y
   * @returns {Point} This point (for chaining)
   */
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

  /**
   * Creates a new point scaled by x
   * @param {number} dx - Factor for x
   * @returns {Point} New scaled point
   */
  scaleX (dx: number): Point {
    return new Point(this.x * dx, this.y)
  }

   /**
   * Creates a new point scaled by y
   * @param {number} dy - Factor for y
   * @returns {Point} New scaled point
   */
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

  /**
   * Calculates the dot product with another point
   * @param {TPoint} p - Other point
   * @returns {number} Dot product
   */
  dot (p: TPoint) {
   return this.x * p.x + this.y * p.y
  }

  /**
   * Calculates the cross product with another point
   * @param {TPoint} p - Other point
   * @returns {number} Cross product
   */
  cross (p: TPoint) {
   return this.x * p.y - this.y * p.x
  }

  /**
   * Creates a new point rotated by the specified angle
   * @param {number} deg - Rotation angle in degrees
   * @returns {Point} New rotated point
   */
  rotate (deg: number): Point {
    const a = rad(deg)
    return new Point(this.x + Math.cos(a), this.y + Math.sin(a))
  }

  /**
   * Rotates this point by the specified angle
   * @param {number} deg - Rotation angle in degrees
   * @returns {Point} This point (for chaining)
   */
  rotateSelf (deg: number): Point {
    const a = rad(deg)
    this.shiftSelf(Math.cos(a), Math.sin(a))
    return this
  }

  /**
   * Creates a new point with negated coordinates
   * @returns {Point} New negated point
   */
  neg (): Point {
    return new Point(-this.x, -this.y)
  }

  /**
   * Creates a new point with negated x-coordinate
   * @returns {Point} New point with negated x
   */
  negX (): Point {
    return new Point(-this.x, this.y)
  }

  /**
   * Creates a new point with negated y-coordinate
   * @returns {Point} New point with negated y
   */
  negY (): Point {
    return new Point(this.x, -this.y)
  }

  /**
   * Negates this point's coordinates
   * @returns {Point} This point (for chaining)
   */
  negSelf (): Point {
    this.x *= -1
    this.y *= -1
    return this
  }

  /**
   * Negates this point's x-coordinate
   * @returns {Point} This point (for chaining)
   */
  negXSelf (): Point {
    this.x *= -1
    return this
  }

  /**
   * Negates this point's y-coordinate
   * @returns {Point} This point (for chaining)
   */
  negYSelf (): Point {
    this.y *= -1
    return this
  }

  /**
   * Alias for neg()
   * @returns {Point} New negated point
   */
  negative (): Point { return this.neg() }
  /**
   * Alias for negX()
   * @returns {Point} New point with negated x
   */
  negativeX (): Point { return this.negX() }
  /**
   * Alias for negY()
   * @returns {Point} New point with negated y
   */
  negativeY (): Point { return this.negY() }
   /**
   * Alias for negSelf()
   * @returns {Point} This point (for chaining)
   */
  negativeSelf (): Point { return this.negSelf() }
   /**
   * Alias for negXSelf()
   * @returns {Point} This point (for chaining)
   */
  negativeXSelf (): Point { return this.negXSelf() }
  /**
   * Alias for negYSelf()
   * @returns {Point} This point (for chaining)
   */
  negativeYSelf (): Point { return this.negYSelf() }

  /**
   * Returns point coordinates as array
   * @returns {Array<number>} [x, y] array
   */
  arr (): [number, number] {
    return [this.x, this.y]
  }

  /**
   * Creates a new point with absolute coordinates
   * @returns {Point} New point with absolute values
   */
  abs (): Point {
    return new Point(Math.abs(this.x), Math.abs(this.y))
  }

  /**
   * Makes this point's coordinates absolute
   * @returns {Point} This point (for chaining)
   */
  absSelf (): Point {
    this.x = Math.abs(this.x) 
    this.y = Math.abs(this.y)
    return this
  }

  /**
   * Creates a new point with integer coordinates
   * @returns {Point} New point with integer values
   */
  int (): Point {
    return new Point(0 | this.x, 0 | this.y)
  }

  /**
   * Converts this point's coordinates to integers
   * @returns {Point} This point (for chaining)
   */
  intSelf (): Point {
    this.x = 0 | this.x
    this.y = 0 | this.y
    return this
  }

  uv (size: TSize): Point
  uv (width: number, height: number): Point
  /**
   * Converts to UV coordinates (0 to 1 range, y flipped)
   * @param {TSize} size - Size object
   * @param {number} width - Width
   * @param {number} height - Height
   * @returns {Point} New point in UV coordinates
   * @throws {Error} If arguments are unsupported
   */
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
  /**
   * Converts this point to UV coordinates
   * @param {TSize} size - Size object
   * @param {number} width - Width
   * @param {number} height - Height
   * @returns {Point} This point (for chaining)
   * @throws {Error} If arguments are unsupported
   */
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
  /**
   * Converts to math coordinates (-1 to 1 range)
   * @param {TSize} size - Size object
   * @param {number} width - Width
   * @param {number} height - Height
   * @returns {Point} New point in math coordinates
   * @throws {Error} If arguments are unsupported
   */
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
  /**
   * Converts this point to math coordinates
   * @param {TSize} size - Size object
   * @param {number} width - Width
   * @param {number} height - Height
   * @returns {Point} This point (for chaining)
   * @throws {Error} If arguments are unsupported
   */
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
  /**
   * Converts to screen coordinates from UV or math coordinates
   * @param {TSize} size - Size object
   * @param {string} from - Source coordinate system ('uv' or 'math')
   * @param {number} width - Width
   * @param {number} height - Height
   * @returns {Point} New point in screen coordinates
   * @throws {Error} If arguments are unsupported
   */
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
  /**
   * Converts this point to screen coordinates from UV or math coordinates
   * @param {TSize} size - Size object
   * @param {string} from - Source coordinate system ('uv' or 'math')
   * @param {number} width - Width
   * @param {number} height - Height
   * @returns {Point} This point (for chaining)
   * @throws {Error} If arguments are unsupported
   */
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

  /**
   * Checks if this point equals another point
   * @param {TPoint} point - Point to compare with
   * @returns {boolean} True if points are equal
   */
  equals (point: TPoint): boolean {
    return this === point || (point.x === this.x && point.y === this.y)
  }

  /**
   * Checks if another point is within specified radius
   * @param {TPoint} point - Point to check
   * @param {number} radius - Radius threshold
   * @returns {boolean} True if point is within radius
   */
  inRadius (point: TPoint, radius: number) {
    return Math.abs(this.distance(point)) <= radius
  }

  /**
   * Calculates distance to another point
   * @param {TPoint} point - Target point
   * @returns {number} Distance to point
   */
  distance (point: TPoint) {
    return Point.distance(this, point)
  }

  /**
   * Creates a new point with swapped x and y coordinates
   * @returns {Point} New point with swapped axes
   */
  swapAxis () {
    return new Point(this.y, this.x)
  }

  /**
   * Swaps x and y coordinates of this point
   * @returns {Point} This point (for chaining)
   */
  swapAxisSelf () {
    const x = this.x
    this.x = this.y
    this.y = x
    return this
  }

  /** @deprecated use method dup() instead */
  clone () {
    return this.dup()
  }

  /**
   * Creates a copy of this point
   * @returns {Point} New point with same coordinates
   */
  dup () {
    return new Point(this.xy[0], this.xy[1])
  }

  /**
   * Gets a zero point (0, 0)
   * @static
   * @type {Point}
   */
  static get zero (): Point { return new Point(0, 0) }
  
  /**
   * Gets a point with coordinates (1, 1)
   * @static
   * @type {Point}
   */
  static get one (): Point { return new Point(1, 1) }

  /**
   * Calculates distance between two points
   * @static
   * @param {TPoint} p0 - First point
   * @param {TPoint} p1 - Second point
   * @returns {number} Distance between points
   */
  static distance (p0: TPoint, p1: TPoint): number {
    const dx = Math.pow(p1.x - p0.x, 2)
    const dy = Math.pow(p1.y - p0.y, 2)
    return Math.sqrt(dx + dy)
  }

  /**
   * Checks if point is inside circle
   * @static
   * @param {TPoint} p0 - Circle center
   * @param {TPoint} p1 - Point to check
   * @param {number} r - Circle radius
   * @returns {boolean} True if point is inside circle
   */
  static inCircle(p0: TPoint, p1: TPoint, r: number) {
    const dx = Math.pow(p1.x - p0.x, 2)
    const dy = Math.pow(p1.y - p0.y, 2)
    return (dx + dy) < r * r
  }

  /**
   * Calculates middle point between two points
   * @static
   * @param {TPoint} p0 - First point
   * @param {TPoint} p1 - Second point
   * @returns {TPoint} Middle point
   */
  static middle(p0: TPoint, p1: TPoint): TPoint {
    return { x: (p0.x + p1.x) / 2 , y: (p0.y + p1.y) / 2 }
  }

  /**
   * Creates a Point instance from TPoint object
   * @static
   * @param {TPoint} point - Point object
   * @returns {Point} New Point instance
   */
  static from (point: TPoint) {
    return new Point(point)
  }

  /**
   * Creates a point from angle
   * @static
   * @param {number} rad - Angle in radians
   * @returns {Point} New point on unit circle
   */
  static fromAngle (rad: number) {
    return new Point(Math.cos(rad), Math.sin(rad))
  }
}


/**
 * Checks if value is a TPoint object
 * @param {any} value - Value to check
 * @returns {boolean} True if value is TPoint
 */
export function isTPoint (value: any) {
  const point = value as TPoint
  return point && typeof point.x === 'number' && typeof point.y === 'number'
}

/**
 * Copies coordinates from one point to another
 * @param {TPoint} a - Target point
 * @param {TPoint} b - Source point
 * @param {'default' | 'int'} type - Copy type ('int' for integer conversion)
 */
export function copyPoint (a: TPoint, b: TPoint, type: 'default' | 'int' = 'default') {
  a.x = type === 'int' ? 0 | b.x : b.x
  a.y = type === 'int' ? 0 | b.y : b.y
}

/**
 * Creates a zero point object
 * @returns {TPoint} Point with coordinates (0, 0)
 */
export function zeroPoint (): TPoint {
  return { x: 0, y: 0 }
}

/**
 * Creates a point with absolute coordinates
 * @param {TPoint} point - Source point
 * @returns {TPoint} Point with absolute coordinates
 */
export function absPoint (point: TPoint): TPoint {
  return { x: Math.abs(point.x), y: Math.abs(point.y) }
}

/**
 * Creates a point with negated coordinates
 * @param {TPoint} point - Source point
 * @returns {TPoint} Point with negated coordinates
 */
export function negativePoint (point: TPoint): TPoint {
  return { x: -point.x, y: -point.y }
}

/**
 * Creates a point with specified coordinates
 * @param {number} x - X-coordinate
 * @param {number} y - Y-coordinate
 * @returns {TPoint} New point object
 */
export function setPoint (x: number, y: number): TPoint {
  return { x, y }
}

/**
 * Sets the point new coordinates
 * @param {TPoint} point - Point to reset
 * @param {number} x - New x-coordinate
 * @param {number} y - New y-coordinate
 */
export function resetPoint (point: TPoint, x: number, y: number): void {
  point.x = x
  point.y = y
}

/**
 * Multiplies two points component-wise
 * @param {TPoint} p0 - First point
 * @param {TPoint} p1 - Second point
 * @returns {TPoint} Result of multiplication
 */
export function mulPoints (p0: TPoint, p1: TPoint): TPoint {
  return { x: p0.x * p1.x, y: p0.y * p1.y }
}

/**
 * Divides two points component-wise
 * @param {TPoint} p0 - First point
 * @param {TPoint} p1 - Second point
 * @returns {TPoint} Result of division
 */
export function divPoints (p0: TPoint, p1: TPoint): TPoint {
  return { x: p0.x / p1.x, y: p0.y / p1.y }
}

/**
 * Adds two points component-wise
 * @param {TPoint} p0 - First point
 * @param {TPoint} p1 - Second point
 * @returns {TPoint} Result of addition
 */
export function sumPoints (p0: TPoint, p1: TPoint): TPoint {
  return { x: p0.x + p1.x, y: p0.y + p1.y }
}

/**
 * Subtracts two points component-wise
 * @param {TPoint} p0 - First point
 * @param {TPoint} p1 - Second point
 * @returns {TPoint} Result of subtraction
 */
export function subPoints (p0: TPoint, p1: TPoint): TPoint {
  return { x: p0.x - p1.x, y: p0.y - p1.y }
}

/**
 * Normalizes point coordinates to WebGL clip space (-1 to 1)
 * @param {TPoint} point - Point to normalize
 * @param {number} w - Width
 * @param {number} h - Height
 * @returns {TPoint} Normalized point
 */
export function gl_normalize({ x, y }: TPoint, w: number, h: number) {
  return setPoint (x / (w * 0.5)  -  1.0, 1.0 - y / (h * 0.5))
}