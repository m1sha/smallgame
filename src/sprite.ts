import { Surface } from "./surface"
import { Drawable } from "./drawable"
import { ObservableRect, Rect } from "./rect"

export abstract class Sprite extends Drawable {
  image: Surface
  rect: Rect | ObservableRect
  collideRect: Rect | ObservableRect | null = null

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