import { Surface } from './surface'

export abstract class Drawable {
  abstract draw(suface: Surface): void
}