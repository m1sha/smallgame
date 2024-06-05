import { Surface } from 'surface'

export abstract class Drawable {
  abstract update(suface: Surface): void
}