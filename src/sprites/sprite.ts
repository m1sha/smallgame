import { Surface, SurfaceBase } from "../surface"
import { Entity } from "../entity"
import { Rect } from "../rect"

export class Sprite extends Entity {
  image: Surface

  constructor (image?: Surface, rect?: Rect) {
    super()

    if (image) {
      this.image = image
      this.rect = rect ? rect : this.image.rect
      return
    }

    this.image = Surface.default
    this.rect = this.image.rect
  }
  
  protected update (): void {}

  draw (suface: { blit: (image: SurfaceBase, rect: Rect) => void }, rect?: Rect): void {
    this.update()
    if (!this.image || !this.rect) return
    suface.blit(this.image, rect ?? this.rect)
  }
}