import { Point } from "./point"
import { Rect } from "./rect";
import { Surface } from "./surface"

export class TileMap {
  private image: HTMLImageElement
  private surface: Surface
  private rect: Rect
  private framePosition: Point
  readonly tileWidth: number
  readonly titleHight: number
  x: number = 0
  y: number = 0

  constructor (tileWidth: number, titleHight: number, image: HTMLImageElement, rect: Rect, surfaceWidth: number | undefined = undefined, surfaceHeight: number | undefined = undefined) {
    this.tileWidth = tileWidth
    this.titleHight = titleHight
    this.image = image
    this.rect = rect
    this.framePosition = Point.zero
    this.surface = new Surface(surfaceWidth ? surfaceWidth : tileWidth, surfaceHeight ? surfaceHeight: titleHight, true)
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

    this.surface.draw.drawImage(
      this.image,
      this.framePosition.x,
      this.framePosition.y,
      this.tileWidth || 0,
      this.titleHight || 0,
      (this.x || 0),
      (this.y || 0),
      this.tileWidth || 0,
      this.titleHight || 0
    )

    return this.surface
  }

  static fromImage(tileWidth: number, titleHight: number, image: HTMLImageElement, rect: Rect, surfaceWidth: number | undefined = undefined, surfaceHeight: number | undefined = undefined) {
    return new TileMap(tileWidth, titleHight, image, rect, surfaceWidth, surfaceHeight)
  }
}