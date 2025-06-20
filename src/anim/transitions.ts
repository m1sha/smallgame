import { type AnimationTransition } from "./transition"

export class AnimationTransitions {
  #items: AnimationTransition[] = []

  add (item: AnimationTransition) {
    this.#items.push(item)
  }

  check (currentName: string) {
    for (const item of this.#items) {
      if (item.from !== currentName && item.from.toLowerCase() !== 'any') continue

      const trigger = item.trigger()
      if (!trigger) continue

      const flipX = item.flipX ? item.flipX() : false
      const flipY = item.flipY ? item.flipY() : false

      if (this.onTransition) this.onTransition(item.to, flipX, flipY)
    }
  }

  onTransition: ((name: string, flipX: boolean, flipY: boolean) => void) | null = null
}