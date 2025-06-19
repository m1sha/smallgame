import { type MutableRect, Rect } from "../rect"
import { removeItem } from "./array"

export class CollisionHashmap<T extends { rect: MutableRect | null }> {
  readonly rows: number
  readonly cols: number
  readonly width: number
  readonly height: number
  readonly cellWidth: number
  readonly cellHeight: number
  private rects: Map<MutableRect, T[]> = new Map()
  private sprites: Map<T, MutableRect[]> = new Map()

  constructor (rows: number, cols: number, width: number, height: number) {
    this.rows = rows
    this.cols = cols
    this.width = width
    this.height = height
    this.cellWidth = width / cols
    this.cellHeight = height / rows
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < rows; j++)
        this.rects.set(new Rect(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight), [])
  }

  getCompanions (sprite: T): T[] {
    const rects = this.sprites.get(sprite) ?? []
    const result: T[] = []
    for (const rect of rects) {
      result.push(...(this.rects.get(rect) ?? []))
    }
    return result
  }

  add (sprite: T): void {
    this.sprites.set(sprite, this.getRects(sprite))
  }

  update (sprite: T): void {
    const oldRects = this.sprites.get(sprite)
    if (!oldRects) return
    
    const newRects = this.getRects(sprite)
    
    for (const rect of oldRects) {
      if (!newRects.some(p => p.equals(rect))) {
        removeItem(this.rects.get(rect) ?? [], p => p === sprite)
      }
    }

    this.sprites.set(sprite, newRects)
  }

  private getRects(sprite: T): MutableRect[] {
    if (!sprite.rect) return []
    const result: MutableRect[] = []
    this.rects.forEach((_, rect) => { 
      if (rect.overlaps(sprite.rect!)) result.push(rect) 
    })
    return result
  }
}