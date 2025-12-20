import { Point, TPoint } from "../point"
import { Size, TSize } from "../size"
import { Rect } from "../rect"
import { MemSurface, SurfaceBase } from "../surface"
import { SpriteSheetBatch, TSpriteSheetBatchScheme } from "./sprite-sheet-batch"

export class SpriteSheet {
  private _image: MemSurface
  private frameRect: Rect
  private prevCount = 0
  batches: Map<string, SpriteSheetBatch> = new Map()
  size: Size
  batchAxis: 'x' | 'y' = 'x'

  constructor (
    public readonly surface: SurfaceBase, 
    size: TSize, 
    public readonly rate: number, 
    padding?: TPoint,
    private scheme: TSpriteSheetBatchScheme = {}
    ) {
    this.size = new Size(size)

    
    this.frameRect = Rect.size(new Size(size).expandSelf(padding ?? Point.zero))
    this._image = new MemSurface(size)
  }

  addBatch (name: string, count: number): SpriteSheet
  addBatch (name: string, startIndex: number, count: number): SpriteSheet 
  addBatch (...args: Array<any>): SpriteSheet {
    let count = args[1]
    if (args.length === 3) {
      this.prevCount = args[1]
      count = args[2]
    }
    this.batches.set(args[0], new SpriteSheetBatch(this.prevCount, count, args[0]))
    this.prevCount = count
    return this
  }

  getBatch (name: keyof TSpriteSheetBatchScheme) {
    return this.batches.get(name) ?? null
  }

  defaultBatch () {
    return this.batches.values().next().value ?? null
  }

  get count () { return this.colls * this.rows }
  get colls () { return (0 | this.surface.width / this.frameRect.width)}
  get rows () { return (0 | this.surface.height / this.frameRect.height)}

  flip: 'x' | 'y' | 'xy' | 'none' = 'none'

  getTile (index: number) {
    const cell = this.getCell(index).scaleSelf(-this.frameRect.width, -this.frameRect.height)
    this._image.clear()
    const m = new DOMMatrix()
    if (this.flip === 'x' || this.flip === 'xy') m.multiplySelf(new DOMMatrix().flipX())
    if (this.flip === 'y' || this.flip === 'xy') m.multiplySelf(new DOMMatrix().flipY())
    this._image.blit(this.surface, this.surface.rect.move(cell), { transform: m })
    return this._image
  }

  private getCell (index: number) {
    const col = 0 | (index % this.colls)
    const row = 0 | (index / this.colls)
    
    const h = this.flip === 'y' || this.flip === 'xy' ? this.rows - 1 : row
    const w = this.flip === 'x' || this.flip === 'xy' ? this.colls - 1 : col
    
    return new Point(w,  h)
  }
}