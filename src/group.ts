import { Sprite } from "./sprite"
import { Surface } from "./surface"

export class Group {
  private sprites: Sprite[] = []

  add (sprite: Sprite) {
    this.sprites.push(sprite)
  }

  draw (surface: Surface) {
    for (const sprite of this.sprites) {
      sprite.draw(surface)
    }
  }
}