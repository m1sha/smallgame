import { Surface } from "./surface"
import { Drawable } from "./drawable"
import { Rect } from "./rect"

export class Sprite extends Drawable {
  image: Surface | null = null
  rect: Rect | null = null

  update(suface: Surface): void {
    if (this.image && this.rect) {
      suface.blit(this.image, this.rect)
    }
  }
}