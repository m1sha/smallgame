import { Surface } from "./surface"
import { Drawable } from "./drawable"
import { ObservableRect, Rect } from "./rect"

export abstract class Sprite extends Drawable {
  image: Surface | null = null
  rect: Rect | ObservableRect | null = null

  protected update (): void {}

  draw (suface: Surface): void {
    this.update()
    if (!this.image || !this.rect) return
    suface.blit(this.image, this.rect)
  }
}