import { Point } from "./point"
import { Rect } from "./rect";
import { Surface } from "./surface"

export type TileMapInitOptions = {
  surfaceWidth?: number
  surfaceHeight?: number
  alpha?: boolean
  offscreen?: boolean
  smooth?: boolean
}

export class TileMap {
  private image: HTMLImageElement
  private surface: Surface
  private rect: Rect
  private framePosition: Point
  readonly tileWidth: number
  readonly titleHight: number
  #x: number = 0
  #y: number = 0
  #gap: number = 0

  constructor (tileWidth: number, titleHight: number, image: HTMLImageElement, rect: Rect, options?: TileMapInitOptions) {
    this.tileWidth = tileWidth
    this.titleHight = titleHight
    this.image = image
    this.rect = rect
    this.framePosition = Point.zero
    const surfaceWidth = tileWidth
    const surfaceHeight = titleHight
    const useAlpha = options && typeof options.alpha === 'boolean' ? options.alpha : true 
    const useOffscreen = options && typeof options.offscreen === 'boolean' ? options.offscreen : false
    const useSmooth = options && typeof options.smooth === 'boolean' ? options.smooth : true
    this.surface = new Surface(surfaceWidth, surfaceHeight, { useAlpha, useOffscreen, useSmooth })
  }

  get x () { return this.#x }
  set x (value: number) { this.#x = value + this.#gap }
  get y () { return this.#y }
  set y (value: number) { this.#y = value + this.#gap }
  get gap () { return this.#gap }
  set gap (value: number) {  
    this.#x -= 0 | this.#gap / 2
    this.#y -= 0 | this.#gap / 2
    this.#gap = value
    this.#x += 0 | this.#gap / 2 
    this.#y += 0 | this.#gap / 2
  }

  get cols () {
    return 0 | this.rect.width / this.tileWidth
  }

  get rows () {
    return 0 | this.rect.height / this.titleHight
  }

  get count () {
    return this.cols * this.rows
  }

  get width () {
    return this.rect.width
  }

  get height () {
    return this.rect.height
  }

  get index (): [number, number] {
    return [
      0 | this.framePosition.x / this.tileWidth,
      0 | this.framePosition.y / this.titleHight
    ]
  }

  get flatIndex () {
    const [ row, col ] = this.index
    return row * this.cols + col
  }

  cell (col: number): Surface
  cell (row: number, col: number): Surface
  cell (...args: unknown[]): Surface {

    if (args.length == 1 && typeof args[0] === 'number') {
      this.framePosition.x = args[0] * this.tileWidth
      this.framePosition.y = 0
    }
    
    if (args.length == 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.framePosition.x = args[1] * this.tileWidth
      this.framePosition.y = args[0] * this.titleHight
    }

    this.surface.clear()
    this.surface.draw.drawImage(
      this.image,
      this.framePosition.x,
      this.framePosition.y,
      this.tileWidth || 0,
      this.titleHight || 0,
      (this.#x || 0),
      (this.#y || 0),
      this.tileWidth || 0,
      this.titleHight || 0
    )

    this.surface.rect.moveSelf(this.framePosition)

    return this.surface
  }

  static fromImage(tileWidth: number, titleHight: number, image: HTMLImageElement, rect: Rect, options?: TileMapInitOptions) {
    return new TileMap(tileWidth, titleHight, image, rect, options)
  }
}