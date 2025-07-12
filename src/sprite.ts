import { Surface } from "./surface"
import { Drawable } from "./drawable"
import { Rect } from "./rect"

export abstract class Sprite extends Drawable {
  image: Surface
  rect: Rect
  collideRect: Rect | null = null

  constructor () {
    super()

    this.image = Surface.default
    this.rect = this.image.rect
  }

  async create (): Promise<void> {}
  protected update (): void {}

  draw (suface: Surface): void {
    this.update()
    if (!this.image || !this.rect) return
    suface.blit(this.image, this.rect)
  }
}