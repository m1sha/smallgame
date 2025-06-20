import { loadTileMap } from "../assets"
import { Surface } from "../surface"
import { Animation, type IAnimation } from "./animation"
import { type AnimationTransition } from "./transition"
import { AnimationTransitions } from "./transitions"

export type AnimationName = string
export type AnimationSource = string
export type AnimationOptions = { tileWidth: number, titleHight: number, rate: number }
export type AddAnimationOptions = { url: string } & AnimationOptions
type AnimationItem = { name: string, animation: Animation }
export function setAnimation (tileWidth: number, titleHight: number, rate: number, url: string): AddAnimationOptions {
  return { tileWidth, titleHight, rate, url}
}

export type EndAnimationLoopCallback = (name: string) => void

export class Animator implements IAnimation {
  #items: AnimationItem[] = []
  #current: AnimationItem | null = null
  onEndAnimationLoop: EndAnimationLoopCallback | null = null
  #transitions: AnimationTransitions
  #flipX: boolean = false
  #flipY: boolean = false

  constructor () {
    this.#transitions = new AnimationTransitions()
    this.#transitions.onTransition = (name, flipX, flipY) => { 
      this.set(name) 
      this.#flipX = flipX
      this.#flipY = flipY
    }
  }

  async add (name: string, { tileWidth, titleHight, url, rate }: AddAnimationOptions): Promise<void> {
    const map = await loadTileMap(tileWidth, titleHight, url)
    const animation = new Animation(map, rate)
    this.#items.push({ name, animation })
  }

  async bulk (list: [AnimationName, AnimationSource][], { tileWidth, titleHight, rate }: AnimationOptions): Promise<void> {
    const promises = list.map(
      ([name, url]) => this.add(name, { tileWidth, titleHight, url, rate })
    )
    await Promise.all(promises)
  }

  entry (name: string): void  {
    this.set(name)
  }

  addTransition (transition: AnimationTransition) {
    this.#transitions.add(transition)
  }

  set (name: string): void {
    this.#current = this.#items.find(p => p.name === name) ?? null
    
    if (this.#current) this.#current.animation.onEndAnimationLoop = () => {
      if (this.onEndAnimationLoop && this.#current) {
        this.onEndAnimationLoop(this.#current.name)
      }
    }

    this.play()
  }

  tick (): void {
    this.#transitions.check(this.#current?.name ?? '')
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
    
    const img = this.#current.animation.image
    if (this.#flipX && this.#flipY) {
      img.flip('xy')
    } else if (this.#flipX) {
      img.flip('x')
    } else if (this.#flipY) {
      img.flip('y')
    }

    return img
  }

  get animations () { return this.#items.map(p => p.name) }
}