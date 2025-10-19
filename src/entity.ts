import { Rect } from "./rect"

export abstract class Entity {
  rect: Rect

  constructor () {
    this.rect = Rect.zero
  }

  get collideRect () {
    return this.rect
  }

  async create (): Promise<void> {}
  protected abstract update (): void
}