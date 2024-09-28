import { Screen } from "./screen"
import { EventController } from "./events/event-controller"
import { GameEvents } from "./events/game-event"
import { Keys } from "./keys/keys"
import { InternalTimeSetter } from "./time"
import { ViewportType } from "./viewport"
import { FPSCounter, millis } from "./utils"

export class Game {
  readonly event: GameEvents
  readonly key: Keys
  private readonly controller: EventController 
  #screen: Screen | null = null
  
  constructor () {
    this.event = new GameEvents()
    this.key = new Keys
    this.controller = new EventController(this)
  }

  private init (width: number, height: number, containter: HTMLElement, viewportType: ViewportType = 'transform'): Screen {
    if (this.#screen) return this.#screen
    this.#screen = new Screen(viewportType, width, height)
    containter.append(this.#screen.viewport.htmlContainer as any)
    this.controller.init(this.#screen)
    return this.#screen
  }

  static create(width: number, height: number, containter: HTMLElement, viewportType: ViewportType = 'transform', willReadFrequently = true) {
    Game.willReadFrequently = willReadFrequently
    const game = new Game()
    return { game, screen: game.init(width, height, containter, viewportType) }
  }

  static willReadFrequently = true
}


export const gameloop = (callback: () => void) => {
  let lastTime = millis()  
  const nextFrame = () => {
    requestAnimationFrame(nextFrame)  
     
    const delta = (millis() - lastTime) / 1000
    InternalTimeSetter.deltaTime = delta
    FPSCounter.update()
    lastTime = millis()
    
    callback()
  }
  requestAnimationFrame(nextFrame)  
}