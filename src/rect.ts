import { absPoint, copyPoint, isTPoint, Point, setPoint, subPoints, type TPoint, zeroPoint } from "./point"
import { type Pivote } from './pivote'
import { Size, type TSize } from "./size"

export type TRect = { x: number, y: number, width: number, height: number }

/**
 * Axis‑aligned rectangle
 *
 * All coordinates are expressed in the same units as {@link Point}.
 */
export class Rect {
  /** X‑coordinate of the top‑left corner. */
  x: number
  /** Y‑coordinate of the top‑left corner. */
  y: number
  /** Width of the rectangle. */
  width: number
  /** Height of the rectangle. */
  height: number

  /**
   * Creates a new {@link Rect}.
   *
   * @param {number} x      X‑coordinate of the top‑left corner.
   * @param {number} y      Y‑coordinate of the top‑left corner.
   * @param {number} width  Width of the rectangle.
   * @param {number} height Height of the rectangle.
   */
  constructor (x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  /** @returns {Point} Top‑left corner as a {@link Point}. */
  get topLeft (): Point { 
    return new Point(this.x, this.y)
  }
  /** @param {TPoint} value New top‑left corner. */
  set topLeft (value: TPoint) {
    this.x = value.x
    this.y = value.y
  }

  /** @returns {Point} Top‑right corner. */
  get topRight (): Point { 
    return new Point (this.absWidth, this.y)
  }

  /** @param {TPoint} value New top‑right corner. */
  set topRight (value: TPoint) {
    this.width = value.x - this.x
    this.y = this.y
  }

  /** @returns {Point} Bottom‑left corner. */
  get bottomLeft (): Point { 
    return new Point(this.x, this.absHeight)
  }

  /** @param {TPoint} value New bottom‑left corner. */
  set bottomLeft (value: TPoint) {
    this.x = this.x
    this.height = value.y - this.y
  }

  /** @returns {Point} Bottom‑right corner. */
  get bottomRight (): Point { 
    return new Point(this.absWidth, this.absHeight)
  }

  /** @param {TPoint} value New bottom‑right corner. */
  set bottomRight (value: TPoint) {
    this.width = value.x - this.x
    this.height = value.y - this.y
  }

  /** @returns {number} X‑coordinate of the right edge (x + width). */
  get absWidth () {
    return this.x + this.width
  }

  /** @returns {number} Y‑coordinate of the bottom edge (y + height). */
  get absHeight () {
    return this.y + this.height
  }

  /** @returns {Point} Center point relative to the rectangle’s origin. */
  get center (): Point {
    return new Point(this.width / 2, this.height / 2)
  }

  /** Moves the rectangle so that its centre aligns with {@link value}. */
  set center (value: TPoint) {
    this.moveSelf(value, 'center-center')
  }

  /** @returns {Point} Absolute centre (relative to the global coordinate space). */
  get absCenter (): Point {
    const { x, y } = this.center
    return new Point(this.x + x, this.y + y)
  }

  /** @param {TPoint} value New absolute centre. */
  set absCenter (value: TPoint) {
    const { x, y } = this.center
    this.x = value.x - x
    this.y = value.y - y
  }

  /** @returns {Point} Mid‑left point (center of the left edge). */
  get midLeft () {
    return new Point(this.x, this.y + this.height / 2)
  }

  /** @returns {Point} Mid‑right point (center of the right edge). */
  get midRight () {
    return new Point(this.x + this.width, this.y + this.height / 2)
  }

  /** @returns {Point} Mid‑top point (center of the top edge). */
  get midTop () {
    return new Point(this.x + this.width / 2, this.y)
  }

  /** @returns {Point} Mid‑bottom point (center of the bottom edge). */
  get midBottom () {
    return new Point(this.x + this.width / 2, this.y + this.height)
  }

  /** @returns {number} Length of the diagonal (Pythagorean). */
  get diagonal () { return Math.sqrt(this.width * this.width + this.height * this.height) }

  /**
   * @returns {[TPoint, TPoint, TPoint, TPoint]} Four points in the order:
   * top‑left, top‑right, bottom‑right, bottom‑left.
   */
  get points (): [TPoint, TPoint, TPoint, TPoint] {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft]
  }

  /** @returns {number} Width‑to‑height ratio. */
  get ratio () { return this.width / this.height }

  /** @returns {Size} Current size as a {@link Size} instance. */
  get size () {
    return new Size(this.width, this.height)
  }

  /**
   * Checks if this rectangle overlaps with another rectangle
   * @param rect - The rectangle to check overlap with
   * @returns True if rectangles overlap, false otherwise
   */
  overlaps (rect: TRect) {
    const x = Math.max(this.x, rect.x)
    const y = Math.max(this.y, rect.y)
    const x2 = Math.min(this.x + this.width, rect.x + rect.width)
    const y2 = Math.min(this.y + this.height, rect.y + rect.height)
    const w = x2 - x
    const h = y2 - y
    return w > 0 && h > 0
  }

  /**
   * Gets the overlapping rectangle between this and another rectangle
   * @param rect - The rectangle to check overlap with
   * @returns The overlapping rectangle or null if no overlap
   */
  getOverlapRect (rect: TRect) {
    const x = Math.max(this.x, rect.x)
    const y = Math.max(this.y, rect.y)
    const x2 = Math.min(this.x + this.width, rect.x + rect.width)
    const y2 = Math.min(this.y + this.height, rect.y + rect.height)
    const w = x2 - x
    const h = y2 - y
    return (w > 0 && h > 0) ? new Rect(x, y, w, h) : null
  }

  /**
   * Determines which sides of this rectangle touch another rectangle
   * @param rect - The rectangle to check against
   * @returns Array of touching sides ['left'|'right'|'top'|'bottom']
   */
  touchSide (rect: TRect): ('left' | 'right' | 'top' | 'bottom')[] {
    const result: ('left' | 'right' | 'top' | 'bottom')[] = new Array(2)
    const { x, y } = this.absCenter
    if (x > rect.x) result[0] = 'right'
    if (x < rect.x) result[0] = 'left'
    if (y < rect.y) result[1] = 'bottom'
    if (y > rect.y) result[1] = 'top'
    return result
  }

  /**
   * Checks if this rectangle is completely inside another rectangle
   * @param rect - The containing rectangle
   * @returns True if this rectangle is inside the other rectangle
   */
  inside (rect: TRect): boolean {
    return rect.x <= this.x && rect.y <= this.y && (this.x + this.width) <= (rect.x + rect.width) && (this.y + this.height) <= (rect.y + rect.height)
  }

  /**
   * Checks if this rectangle contains another rectangle
   * @param rect - The rectangle to check
   * @returns True if this rectangle contains the other rectangle
   */
  contains (rect: Rect) {
    return ((rect.x >= this.x && rect.x <= this.absWidth) && (rect.y >= this.y && rect.y <= this.absHeight)) ||
    ((this.x >= rect.x && this.x <= rect.absWidth) && (this.y >= rect.y && this.y <= rect.absHeight))
  }

  /**
   * Checks if this rectangle contains a point
   * @param point - The point to check
   * @returns True if this rectangle contains the point
   */
  containsPoint ({x, y}: TPoint) {
    return x >= this.x && x <= this.absWidth &&  y>= this.y && y <= this.absHeight
  }

  /**
   * Checks if this rectangle equals another rectangle
   * @param rect - The rectangle to compare with
   * @returns True if rectangles are equal
   */
  equals (rect: Rect | TRect) {
    if (this === rect) return true
    return this.x == rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height
  }

  /**
   * Creates a new rectangle with padding (positive value)/margin (nigative value) applied
   * @param padding - Uniform padding for all sides
   * @returns New rectangle with applied padding
   */
  outline (padding: number): Rect
  /**
   * Creates a new rectangle with specific padding for each side
   * @param top - Top padding
   * @param left - Left padding
   * @param bottom - Bottom padding
   * @param right - Right padding
   * @returns New rectangle with applied padding
   */
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

  /** @deprecated use method dup() instead */
  clone () {
    return new Rect(this.x, this.y, this.width, this.height)
  }

  /** 
   * Creates a copy of this rectangle 
   * @returns A new rectangle with the same properties
   */
  dup () {
    return new Rect(this.x, this.y, this.width, this.height)
  }

  /** 
   * Transfers the rectangle to a new position 
   * @param point - New position as a point
   * @param pivote - Pivot point for positioning
   * @returns New rectangle at the new position
   */
  move (point: TPoint, pivote?: Pivote | TPoint): Rect
  /** 
   * Transfers the rectangle to a new position 
   * @param x - New x position
   * @param y - New y position
   * @param pivote - Pivot point for positioning
   * @returns New rectangle at the new position
   */
  move (x: number, y: number, pivote?: Pivote | TPoint): Rect
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

  /** 
   * Moves this rectangle to a new position (mutating)
   * @param point - New position as a point
   * @param pivote - Pivot point for positioning
   * @returns This rectangle at the new position
   */
  moveSelf (point: TPoint, pivote?: Pivote | TPoint): Rect
  /** 
   * Moves this rectangle to a new position (mutating)
   * @param x - New x position
   * @param y - New y position
   * @param pivote - Pivot point for positioning
   * @returns This rectangle at the new position
   */
  moveSelf (x: number, y: number, pivote?: Pivote | TPoint): Rect
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

  /** 
   * Shifts the rectangle by relative coordinates
   * @param point - Relative shift as a point
   * @param pivote - Pivot point for shifting
   * @returns New shifted rectangle
   */
  shift (point: TPoint, pivote?: Pivote): Rect
  /** 
   * Shifts the rectangle by relative coordinates
   * @param x - Relative x shift
   * @param y - Relative y shift
   * @param pivote - Pivot point for shifting
   * @returns New shifted rectangle
   */
  shift (x: number, y: number, pivote?: Pivote): Rect
  shift (...args: Array<any>): Rect  {
    
    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      const [x, y] = this.calcShiftPivote(args[2])
      const n =  setPoint(args[0], args[1])
      return new Rect(this.x + n.x + x, this.y + n.y + y, this.width, this.height)
    } else {
      const point = args[0] as TPoint
      const [x, y] = this.calcPivote(args[1])
      if (point && typeof point.x === 'number' && typeof point.y === 'number') {
        return new Rect(this.x + point.x + x, this.y + point.y + y, this.width, this.height)
      }
    }
    throw new Error('Unsupport arguments.')
  }

  /** 
   * Shifts this rectangle by relative coordinates (mutating)
   * @param point - Relative shift as a point
   * @param pivote - Pivot point for shifting
   * @returns This shifted rectangle
   */
  shiftSelf (point: TPoint, pivote?: Pivote): Rect
  /** 
   * Shifts this rectangle by relative coordinates (mutating)
   * @param x - Relative x shift
   * @param y - Relative y shift
   * @param pivote - Pivot point for shifting
   * @returns This shifted rectangle
   */
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
  
  /** 
   * Resizes the rectangle to new dimensions
   * @param size - New size as TSize
   * @returns New resized rectangle
   */
  resize (size: TSize): Rect
  /** 
   * Resizes the rectangle to new dimensions
   * @param width - New width
   * @param height - New height
   * @returns New resized rectangle
   */
  resize (width: number, height: number): Rect
  /** 
   * Resizes the rectangle to new square dimensions
   * @param value - New width and height
   * @returns New resized rectangle
   */
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

  /** 
   * Resizes this rectangle to new dimensions (mutating)
   * @param size - New size as TSize
   * @returns This resized rectangle
   */
  resizeSelf (size: TSize): Rect
  /** 
   * Resizes this rectangle to new dimensions (mutating)
   * @param width - New width
   * @param height - New height
   * @returns This resized rectangle
   */
  resizeSelf (width: number, height: number): Rect
  /** 
   * Resizes this rectangle to new square dimensions (mutating)
   * @param value - New width and height
   * @returns This resized rectangle
   */
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

  /** 
   * Scales the rectangle dimensions
   * @param dw - Width scaling factor
   * @param dh - Height scaling factor
   * @returns New scaled rectangle
   */
  scalesize (dw: number, dh: number): Rect
  /** 
   * Scales the rectangle dimensions
   * @param size - Scaling factors as TSize
   * @returns New scaled rectangle
   */
  scalesize (size: TSize): Rect
  /** 
   * Scales the rectangle dimensions uniformly
   * @param value - Scaling factor for both dimensions
   * @returns New scaled rectangle
   */
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

  /** 
   * Scales this rectangle dimensions (mutating)
   * @param dw - Width scaling factor
   * @param dh - Height scaling factor
   * @returns This scaled rectangle
   */
  scalesizeSelf (dw: number, dh: number): Rect
  /** 
   * Scales this rectangle dimensions (mutating)
   * @param size - Scaling factors as TSize
   * @returns This scaled rectangle
   */
  scalesizeSelf (size: TSize): Rect
  /** 
   * Scales this rectangle dimensions uniformly (mutating)
   * @param value - Scaling factor for both dimensions
   * @returns This scaled rectangle
   */
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

  /** 
   * Scales the rectangle with pivot point consideration
   * @param dw - Width scaling factor
   * @param dh - Height scaling factor
   * @param pivote - Pivot point for scaling
   * @returns New scaled rectangle
   */
  scale (dw: number, dh: number, pivote?: Pivote | TPoint): Rect
  /** 
   * Scales the rectangle uniformly with pivot point consideration
   * @param value - Scaling factor
   * @param pivote - Pivot point for scaling
   * @returns New scaled rectangle
   */
  scale (value: number, pivote?: Pivote | TPoint): Rect
  scale (...args: Array<any>): Rect {
    return Rect.from(scaleRect(this, ...args))
  }

  /** 
   * Scales this rectangle with pivot point consideration (mutating)
   * @param dw - Width scaling factor
   * @param dh - Height scaling factor
   * @param pivote - Pivot point for scaling
   * @returns This scaled rectangle
   */
  scaleSelf (dw: number, dh: number, pivote?: Pivote | TPoint): Rect
  /** 
   * Scales this rectangle uniformly with pivot point consideration (mutating)
   * @param value - Scaling factor
   * @param pivote - Pivot point for scaling
   * @returns This scaled rectangle
   */
  scaleSelf (value: number, pivote?: Pivote | TPoint): Rect
  scaleSelf (...args: Array<any>): Rect {
    const [x, y, w, h] = scaleRect(this, ...args)
    this.x = x; this.y = y; this.width = w; this.height = h;
    return this
  }

  /** 
   * Creates a union rectangle that encompasses both rectangles
   * @param rect - Rectangle to union with
   * @returns New rectangle encompassing both
   */
  union (rect: TRect) {
    return Rect.fromTwoPoints(
      new Point(Math.min(this.x, rect.x), Math.min(this.y, rect.y) ), 
      new Point(Math.max(this.absWidth, rect.width + rect.x), Math.max(this.absHeight, rect.height + rect.y))
    )
  }

  /** 
   * Unions this rectangle with another rectangle (mutating)
   * @param rect - Rectangle to union with
   * @returns This rectangle encompassing both
   */
  unionSelf (rect: TRect) {
    this.topLeft = new Point(Math.min(this.x, rect.x), Math.min(this.y, rect.y) )
    this.bottomRight = new Point(Math.max(this.absWidth, rect.width + rect.x), Math.max(this.absHeight, rect.height + rect.y))
    return this
  }

  /** 
   * Rotates the rectangle around a pivot point
   * @param a - Rotation angle in degrees
   * @param pivot - Pivot point for rotation
   * @returns New rotated PolyRect
   */
  rotate (a: number, pivot?: number | TPoint) {
    const { x, y, width, height } = this
    return new PolyRect(x, y, width, height).rotateSelf(a, pivot as any)
  }

  /** 
   * Gets WebGL vertex coordinates
   * @param size - Size for normalization
   * @param tri - Triangle mode ('triangle-strip' or 'triangles')
   * @returns Array of vertex coordinates
   */
  gl (size: TSize, tri: 'triangle-strip' | 'triangles' = 'triangle-strip') {
    if (tri === 'triangle-strip')
    return [
      ...this.bottomLeft.math(size).arr(),
      ...this.topLeft.math(size).arr(),
      ...this.bottomRight.math(size).arr(),
      ...this.topRight.math(size).arr(),
    ]

    return [
      ...this.bottomLeft.math(size).arr(),
      ...this.topLeft.math(size).arr(),
      ...this.bottomRight.math(size).arr(),
      
      ...this.topRight.math(size).arr(),
      ...this.bottomRight.math(size).arr(),
      ...this.topLeft.math(size).arr(),
    ]
  }

  /** 
   * Gets WebGL UV coordinates
   * @param size - Size for normalization
   * @param tri - Triangle mode ('triangle-strip' or 'triangles')
   * @returns Array of UV coordinates
   */
  uv (size: TSize, tri: 'triangle-strip' | 'triangles' = 'triangle-strip') {
    if (tri === 'triangle-strip')
      return [
        ...this.bottomLeft.uv(size).arr(),
        ...this.topLeft.uv(size).arr(),
        ...this.bottomRight.uv(size).arr(),
        ...this.topRight.uv(size).arr(),
       ]
    return [
      ...this.bottomLeft.uv(size).arr(),
      ...this.topLeft.uv(size).arr(),
      ...this.bottomRight.uv(size).arr(),
      
      ...this.topRight.uv(size).arr(),
      ...this.bottomRight.uv(size).arr(),
      ...this.topLeft.uv(size).arr(),
    ]
  }

  /**
   * Gets a zero rectangle (0,0,0,0)
   */
  static get zero () {
    return new Rect(0, 0, 0, 0)
  }

  /** 
   * Creates a rectangle from size parameters
   * @param width - Width of rectangle
   * @param height - Height of rectangle
   * @param pos - Position configuration
   * @returns New rectangle
   */
  static size (width: number, height: number, pos?: any): Rect
  /** 
   * Creates a rectangle from size object
   * @param size - Size as TSize
   * @param pos - Position configuration
   * @returns New rectangle
   */
  static size (size: TSize, pos?: any): Rect
  static size (...args: Array<any>): Rect {
    if (args[0] && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      const r = new Rect(0, 0, args[0].width, args[0].height)
      if (args[3]) {
        const pos = args[3]
        const movetoField = Object.keys(pos)[0]
        ;(r as any)[movetoField] = pos[movetoField]
      }
      return r
    }
    if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      const r = new Rect(0, 0, args[0], args[1])
       if (args[2]) {
        const pos = args[2]
        const movetoField = Object.keys(pos)[0]
        ;(r as any)[movetoField] = pos[movetoField]
      }
      return r
    }
    throw new Error('Unsupport arguments.')
  }

  /** 
   * Creates a rectangle from TRect or array format
   * @param rect - Rectangle data as TRect or [x,y,width,height]
   * @returns New rectangle
   */
  static from (rect: TRect | [number, number, number, number]) {
    return Array.isArray(rect) ? new Rect(rect[0], rect[1], rect[2], rect[3]) : new Rect(rect.x, rect.y, rect.width, rect.height)
  }

  /** 
   * Creates a rectangle from two corner points
   * @param p0 - First corner point
   * @param p1 - Second corner point
   * @returns New rectangle
   */
  static fromTwoPoints (p0: TPoint, p1: TPoint) {
    const p = absPoint(subPoints(p1, p0))
    return new Rect(p0.x, p0.y, p.x, p.y)
  }

  /** 
   * Creates a rectangle from center point and dimensions
   * @param center - Center point
   * @param width - Rectangle width
   * @param height - Rectangle height
   * @returns New rectangle
   */
  static fromCenter (center: TPoint, width: number, height: number) {
    return new Rect(center.x - width * 0.5, center.y - height * 0.5, width, height)
  }

  /** 
   * Creates a rectangle with specified aspect ratio
   * @param ratio - Aspect ratio (width/height)
   * @param length - Length of fixed side
   * @param side - Which side is fixed ('width' or 'height')
   * @returns New rectangle
   */
  static fromRatio (ratio: number, length: number, side: 'width' | 'height') {
    const w = side === 'width' ? length : length / ratio
    const h = side === 'height' ? length : length * ratio
    return new Rect(0, 0, w, h)
  }

  /** 
   * Merges multiple rectangles into one encompassing rectangle
   * @param rects - Array of rectangles to merge
   * @returns New merged rectangle
   */
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

  /** 
   * Checks if an object is a valid rectangle
   * @param rect - Object to check
   * @returns True if object is a valid rectangle
   */
  static isRect (rect: unknown): boolean {
    if (!rect) return false
    const r = rect as TRect
    return typeof r.x === 'number' && typeof r.y === 'number' && typeof r.width === 'number' && typeof r.height === 'number'
  }

  private calcPivote(pivote?: Pivote | TPoint) {
    if (isTPoint(pivote)) {
      const p = pivote as TPoint
      return [p.x, p.y]
    }
    const pvt = pivote as Pivote

    if (!pvt) return [0, 0]
    switch (pvt) {
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
  private calcShiftPivote(pivote?: Pivote) {
    if (!pivote) return [0, 0]
    switch (pivote) {
      case 'top-left': return [-this.width, -this.height]
      case 'top-right': return [this.width, -this.height]
      case 'bottom-left': return [-this.width, this.height]
      case 'bottom-right': return [this.width, this.height]
      case 'center-center': return [0, 0]
      case 'bottom-center': return [0, 0 | this.height]
      case 'top-center': return [0 | 0, -this.height]
      case 'left-center': return [-this.width, 0]
      case 'right-center': return [this.width, 0]
  
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

function calcScalePivote(size: TSize, pivote?: Pivote) {
  if (!pivote) return [0, 0]
  switch (pivote) {
    case 'top-left': return [0, 0]
    case 'top-right': return [size.width, 0]
    case 'bottom-left': return [0, size.height]
    case 'bottom-right': return [size.width, size.height]
    case 'center-center': return [0 | size.width / 2, 0 | size.height  / 2]
    case 'bottom-center': return [0 | size.width / 2, 0 | size.height]
    case 'top-center': return [0 | size.width / 2, 0]
    case 'left-center': return [0, 0 | size.height  / 2]
    case 'right-center': return [size.width, 0 | size.height  / 2]
    default: return [0, 0]
  }
}

function scalePos ({ x, y, width, height }: TRect, dx: number, dy: number, pivote?: Pivote | TPoint ) {
  if (isTPoint(pivote)) {
    const p = pivote as TPoint
    const nx = p.x -  dx * (p.x - x) 
    const ny = p.y -  dy * (p.y - y) 
    return setPoint(nx, ny) //setPoint(x + p.x * dx, y + p.y * dy) // setPoint(p.x * -dx + p.x + x, p.y * -dy + p.y + y) 
  } else {
    const p = calcScalePivote({ width, height },  pivote as Pivote)
    return setPoint(p[0] * -dx + p[0] + x, p[1] * -dy + p[1] + y)
  }
}

// function scaleRect (point: TPoint, pivote?: Pivote | TPoint): [number, number, number, number]
// function scaleRect (d: number, pivote?: Pivote | TPoint): [number, number, number, number]
// function scaleRect (dx: number, dy: number, pivote?: Pivote | TPoint): [number, number, number, number]
function scaleRect (self: Rect, ...args: Array<any>): [number, number, number, number] {
  if (typeof args[0] === 'number' && (typeof args[1] !== 'number' || typeof args[1] === 'string')) {
    const pos = scalePos(self, args[0], args[0], args[1])
    return [pos.x, pos.y, self.width * args[0], self.height * args[0]]
  }
    
  if (typeof args[0] === 'number' && typeof args[1] === 'number' && (!args[2] || typeof args[2] === 'string' || typeof args[2] === 'object')) {
    const pos = scalePos(self, args[0], args[1], args[2])
    return [pos.x, pos.y, self.width * args[0], self.height * args[1]]
  }

  throw new Error('Unsupport arguments.')
}