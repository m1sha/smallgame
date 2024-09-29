import { loadTileMap } from "../assets"
import { Surface } from "../surface"
import { Animation, IAnimation } from "./animation"

export type AddAnimationOptions = { tileWidth: number, titleHight: number, url: string, rate: number }
type AnimationItem = { name: string, animation: Animation }
export function setAnimation (tileWidth: number, titleHight: number, rate: number, url: string): AddAnimationOptions {
  return { tileWidth, titleHight, rate, url}
}

export class Animator implements IAnimation {
  #items: AnimationItem[] = []
  #current: AnimationItem | null = null

  async add (name: string, { tileWidth, titleHight, url, rate }: AddAnimationOptions): Promise<void> {
    const map = await loadTileMap(tileWidth, titleHight, url)
    const animation = new Animation(map, rate)
    this.#items.push({ name, animation })
  }

  set (name: string): void {
    this.#current = this.#items.find(p => p.name === name) ?? null
  }

  tick (): void {
    this.#current?.animation.tick()
  }

  play (): void {
    this.#current?.animation.play()
  }
  
  pause (): void {
    this.#current?.animation.pause()
  }
  
  stop (): void {
    this.#current?.animation.stop()
  }

  get image (): Surface {
    if (!this.#current) throw new Error('an animation is not set')
    return this.#current.animation.image
  }

  get animations () { return this.#items.map(p => p.name) }
}