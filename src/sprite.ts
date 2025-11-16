import { Surface, SurfaceBase } from "./surface"
import { Entity } from "./entity"
import { Rect } from "./rect"

export abstract class Sprite extends Entity {
  image: Surface

  constructor () {
    super()

    this.image = Surface.default
    this.rect = this.image.rect
  }
  
  protected update (): void {}

  draw (suface: { blit: (image: SurfaceBase, rect: Rect) => void }): void {
    this.update()
    if (!this.image || !this.rect) return
    suface.blit(this.image, this.rect)
  }
}