import { Point, TPoint } from "./point"

export type TSize = { width: number, height: number }
export function setSize (width: number, height: number): TSize { return { width, height }}

export class Size implements TSize {
  width: number
  height: number

  constructor (value: number)
  constructor (value: TSize)
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

  scale (value: number): Size
  scale (value: TSize): Size
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

  scaleSelf (value: number): Size
  scaleSelf (value: TSize): Size
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

  expand (value: number): Size
  expand (value: TSize): Size
  expand (value: TPoint): Size
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

  expandSelf (value: number): Size
  expandSelf (value: TSize): Size
  expandSelf (value: TPoint): Size
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

 
  inverse (): Size
  inverse (value: number): Size
  inverse (value: TSize): Size
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
}