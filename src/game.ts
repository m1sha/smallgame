import { Screen } from "./screen"
import { EventController } from "./events/event-controller"
import { GameEvents } from "./events/game-event"
import { Keys } from "./keys/keys"

export class Game {
  readonly event: GameEvents
  readonly key: Keys
  private readonly controller: EventController 
  #screen: Screen | null = null
  #clock = 0
  #fps: number = 60
  
  constructor () {
    this.event = new GameEvents()
    this.key = new Keys
    this.controller = new EventController(this)
  }

  init (width: number, height: number, containter: HTMLElement): Screen {
    if (this.#screen) return this.#screen
    this.#screen = new Screen(width, height)
    containter.append(this.#screen.draw.canvas as any)
    this.controller.init(this.#screen)
    return this.#screen
  }

  get fps () { return this.#fps }

  loop (callback: () => void, rate: number = 1000 / 60): void {
    requestAnimationFrame(timestamp => {
      if (this.#clock === 0) {
        this.#clock = timestamp
        this.loop(callback)
        return
      }

      if (timestamp < rate + this.#clock) {
        this.loop(callback)
        return
      }
     
      this.#fps = 1000 / (timestamp - this.#clock)
      this.#clock = timestamp
      this.loop(callback)
      callback()
    })
  }

  static create(width: number, height: number, containter: HTMLElement, willReadFrequently = true) {
    Game.willReadFrequently = willReadFrequently
    const game = new Game()
    return { game, screen: game.init(width, height, containter) }
  }

  static willReadFrequently = true
}