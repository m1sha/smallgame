import { Surface } from "./surface"
import { Drawable } from "./drawable"
import { ObservableRect, Rect } from "./rect"

export abstract class Sprite extends Drawable {
  image: Surface | null = null
  rect: Rect | ObservableRect | null = null
  collideRect: Rect | ObservableRect | null = null

  async create (): Promise<void> {}
  protected update (): void {}

  draw (suface: Surface): void {
    this.update()
    if (!this.image || !this.rect) return
    suface.blit(this.image, this.rect)
  }
}