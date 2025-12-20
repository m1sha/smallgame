
import { Size, TSize } from "../size"
import { MemSurface } from "../surface"
import { Sprite } from "./sprite"
import { SpriteSheet } from "./sprite-sheet"
import { SpriteSheetBatch } from "./sprite-sheet-batch"
import { Rect } from "../rect"
import { Time } from "../time"


export class AnimatedSprite extends Sprite {
  private originRect: Rect
  private batch: SpriteSheetBatch | null = null
  private _frameNum = 0
  rotationAngle = 0
  
  constructor (readonly spriteSheet: SpriteSheet, size?: TSize) {
    super ()

    this.originRect = Rect.size(size ? size.width : spriteSheet.size.width, size ? size.height : spriteSheet.size.height)
    const diagonal = this.originRect.diagonal
    this.image = new MemSurface(new Size(diagonal))
    this.rect = this.image.rect
    this.batch = spriteSheet.defaultBatch()
  }

  update (): void {
    const start = this.batch ? this.batch.startIndex : 0
    const end = this.batch ? start + this.batch.count : this.spriteSheet.count
    const rate = this.batch && this.batch.rate ? this.batch.rate : this.spriteSheet.rate

    this._frameNum += Time.deltaTime * rate
    if (this._frameNum > end) this._frameNum = start

    const frameNum = (0 | this._frameNum)
    const sprite = this.spriteSheet.getTile(frameNum)

    this.image.clear()
    this.image.blit(sprite, this.originRect.move(this.rect.center, 'center-center'), { angle: this.rotationAngle, pivote: 'center-center' })
  }

  playBatch (name: string) {
    this.batch = this.spriteSheet.getBatch(name)
  }
}