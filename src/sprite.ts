import { Surface } from "./surface"
import { Entity } from "./entity"

export abstract class Sprite extends Entity {
  image: Surface

  constructor () {
    super()

    this.image = Surface.default
    this.rect = this.image.rect
  }
  
  protected update (): void {}

  draw (suface: Surface): void {
    this.update()
    if (!this.image || !this.rect) return
    suface.blit(this.image, this.rect)
  }
}