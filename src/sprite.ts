import { Surface } from "./surface"
import { Drawable } from "./drawable"
import { Rect } from "./rect"

export abstract class Sprite extends Drawable {
  image: Surface | null = null
  rect: Rect | null = null

  abstract update (): void

  draw (suface: Surface): void {
    if (!this.image || !this.rect) return
    this.update()
    suface.blit(this.image, this.rect)
  }
}