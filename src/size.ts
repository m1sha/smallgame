import { Point, TPoint } from "./point"

export type TSize = { width: number, height: number }
export function setSize (width: number, height: number): TSize { return { width, height }}

/**
 * Represents a size with width and height dimensions.
 */
export class Size implements TSize {
  /** The width dimension */
  width: number
  /** The height dimension */
  height: number

  /**
   * Creates a new Size instance.
   * @param value - A number to set both width and height, or an object with width and height properties
   */
  constructor (value: number)
  /**
   * Creates a new Size instance from another TSize object.
   * @param value - An object implementing TSize interface
   */
  constructor (value: TSize)
   /**
   * Creates a new Size instance with specified width and height.
   * @param width - The width dimension
   * @param height - The height dimension
   */
  constructor (width: number, height: number)
  constructor (...args: Array<any>) {
    if (args.length === 1 && typeof args[0] === 'number') {
      this.width = args[0]
      this.height = args[0]
      return
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      this.width = args[0].width
      this.height = args[0].height
      return
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.width = args[0]
      this.height = args[1]
      return
    }

    throw new Error('unsupported arguments.')
  }

  /**
   * Scales the size by multiplying with the given values.
   * @param value - A number to scale both dimensions, or an object with width and height properties
   * @returns A new Size instance with scaled dimensions
   */
  scale (value: number): Size
   /**
   * Scales the size by multiplying with another TSize object.
   * @param value - An object implementing TSize interface
   * @returns A new Size instance with scaled dimensions
   */
  scale (value: TSize): Size
   /**
   * Scales the size by multiplying width and height with separate values.
   * @param width - The scale factor for width
   * @param height - The scale factor for height
   * @returns A new Size instance with scaled dimensions
   */
  scale (width: number, height: number): Size
  scale (...args: Array<any>): Size {
    if (args.length === 1 && typeof args[0] === 'number') {
      return new Size(this.width * args[0], this.height * args[0])
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      return new Size(this.width * args[0].width, this.height * args[0].height)
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Size(this.width * args[0], this.height * args[1])
    }

    throw new Error('unsupported arguments.')
  }

  /**
   * Scales this size by multiplying with the given values and modifies the current instance.
   * @param value - A number to scale both dimensions, or an object with width and height properties
   * @returns This Size instance with modified dimensions
   */
  scaleSelf (value: number): Size
   /**
   * Scales this size by multiplying with another TSize object and modifies the current instance.
   * @param value - An object implementing TSize interface
   * @returns This Size instance with modified dimensions
   */
  scaleSelf (value: TSize): Size
   /**
   * Scales this size by multiplying width and height with separate values and modifies the current instance.
   * @param width - The scale factor for width
   * @param height - The scale factor for height
   * @returns This Size instance with modified dimensions
   */
  scaleSelf (width: number, height: number): Size
  scaleSelf (...args: Array<any>): Size {
    if (args.length === 1 && typeof args[0] === 'number') {
      this.width *= args[0]
      this.height *= args[0]
      return this
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      this.width *= args[0].width
      this.height *= args[0].height
      return this
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.width *= args[0]
      this.height *= args[1]
      return this
    }

    throw new Error('unsupported arguments.')
  }

  /**
   * Expands the size by adding the given values.
   * @param value - A number to add to both dimensions, or an object with width and height properties
   * @returns A new Size instance with expanded dimensions
   */
  expand (value: number): Size
   /**
   * Expands the size by adding another TSize object.
   * @param value - An object implementing TSize interface
   * @returns A new Size instance with expanded dimensions
   */
  expand (value: TSize): Size
   /**
   * Expands the size by adding a TPoint object's x and y values.
   * @param value - An object implementing TPoint interface
   * @returns A new Size instance with expanded dimensions
   */
  expand (value: TPoint): Size
   /**
   * Expands the size by adding separate width and height values.
   * @param width - The value to add to width
   * @param height - The value to add to height
   * @returns A new Size instance with expanded dimensions
   */
  expand (width: number, height: number): Size
  expand (...args: Array<any>): Size {
    if (args.length === 1 && typeof args[0] === 'number') {
      return new Size(this.width + args[0], this.height + args[0])
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      return new Size(this.width + args[0].width, this.height + args[0].height)
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      return new Size(this.width + args[0].x, this.height + args[0].y)
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Size(this.width + args[0], this.height + args[1])
    }
    

    throw new Error('unsupported arguments.')
  }

  /**
   * Expands this size by adding the given values and modifies the current instance.
   * @param value - A number to add to both dimensions, or an object with width and height properties
   * @returns This Size instance with modified dimensions
   */
  expandSelf (value: number): Size
  /**
   * Expands this size by adding another TSize object and modifies the current instance.
   * @param value - An object implementing TSize interface
   * @returns This Size instance with modified dimensions
   */
  expandSelf (value: TSize): Size
   /**
   * Expands this size by adding a TPoint object's x and y values and modifies the current instance.
   * @param value - An object implementing TPoint interface
   * @returns This Size instance with modified dimensions
   */
  expandSelf (value: TPoint): Size
   /**
   * Expands this size by adding separate width and height values and modifies the current instance.
   * @param width - The value to add to width
   * @param height - The value to add to height
   * @returns This Size instance with modified dimensions
   */
  expandSelf (width: number, height: number): Size
  expandSelf (...args: Array<any>): Size {
    if (args.length === 1 && typeof args[0] === 'number') {
      this.width += args[0]
      this.height += args[0]
      return this
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      this.width += args[0].width
      this.height += args[0].height
      return this
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      this.width += args[0].x
      this.height += args[0].y
      return this
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.width += args[0]
      this.height += args[1]
      return this
    }

    throw new Error('unsupported arguments.')
  }


  /**
   * Returns a new Size with inverted dimensions (1/width, 1/height).
   * @returns A new Size instance with inverted dimensions
   */
  inverse (): Size
  /**
   * Returns a new Size with dimensions inverted using the given divisor.
   * @param value - A number to use as divisor for both dimensions
   * @returns A new Size instance with inverted dimensions
   */
  inverse (value: number): Size
  /**
   * Returns a new Size with dimensions inverted using another TSize object as divisors.
   * @param value - An object implementing TSize interface to use as divisors
   * @returns A new Size instance with inverted dimensions
   */
  inverse (value: TSize): Size
   /**
   * Returns a new Size with dimensions inverted using separate divisors.
   * @param width - The divisor for width
   * @param height - The divisor for height
   * @returns A new Size instance with inverted dimensions
   */
  inverse (width: number, height: number): Size
  inverse (...args: Array<any>): Size {
    if (args.length === 0)
      return new Size(1 / this.width, 1 / this.height)

    if (args.length === 1 && typeof args[0] === 'number') {
      return new Size(args[0] / this.width, args[0] / this.height)
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      return new Size(args[0].width / this.width, args[0].height / this.height)
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      return new Size(args[0] / this.width, args[1] / this.height)
    }

    throw new Error('unsupported arguments.')
  }

  reset (value: number): void
  reset (value: TSize): void
  reset (width: number, height: number): void
  reset (...args: Array<any>): void {
    if (args.length === 1 && typeof args[0] === 'number') {
      this.width = args[0]
      this.height = args[0]
      return
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      this.width = args[0].width
      this.height = args[0].height
      return
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.width = args[0]
      this.height = args[1]
      return
    }

    throw new Error('unsupported arguments.')
  }

  equals (value: number): boolean
  equals (value: TSize): boolean
  equals (width: number, height: number): boolean
  equals (...args: Array<any>): boolean {
    if (args.length === 1 && typeof args[0] === 'number') {
      return this.width === args[0] && this.height === args[0]
    }
    if (args.length === 1 && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      return this.width === args[0].width && this.height === args[0].height
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      return this.width === args[0] && this.height === args[1]
    }

    throw new Error('unsupported arguments.')
  }

  neg (): Size { 
    return new Size(-this.width, -this.height)
  }

  negSelf (): Size { 
    this.width *= -1 
    this.height *= -1
    return this
  }

  negW (): Size { 
    return new Size(-this.width, this.height)
  }

  negWSelf (): Size { 
    this.width *= -1 
    return this
  }

  negH (): Size { 
    return new Size(this.width, -this.height)
  }

  negHSelf (): Size { 
    this.height *= -1
    return this
  }

  toPoint (): Point {
    return new Point(this.width, this.height)
  }

  static get zero () { return new Size(0, 0) }
}