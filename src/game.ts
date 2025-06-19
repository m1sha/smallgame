import { Screen } from "./screen"
import { EventController, GameEvents } from "./events"
import { Keys } from "./keys/keys"
import { InternalTimeSetter } from "./time"
import { type ViewportType } from "./viewport"
import { FPSCounter, millis } from "./utils"

export class Game {
  private readonly controller: EventController 
  #screen: Screen | null = null
  
  constructor () {
    this.controller = new EventController()
  }

  get event (): GameEvents { return this.controller.event }
  get key (): Keys { return this.controller.key }
  get screen (): Screen { return this.screen }

  private init (width: number, height: number, containter: HTMLElement, viewportType: ViewportType = 'transform'): Screen {
    if (this.#screen) return this.#screen
    this.#screen = new Screen(viewportType, width, height)
    const htmlContainer = this.#screen.viewport.htmlContainer as any
    containter.append(htmlContainer)
    this.controller.init(htmlContainer)
    return this.#screen
  }

  kill () {
    this.controller.claerListeners()
  }

  static create (width: number, height: number, containter: HTMLElement, viewportType: ViewportType = 'transform', willReadFrequently = true) {
    Game.willReadFrequently = willReadFrequently
    const game = new Game()
    return { 
      game, 
      screen: game.init(width, height, containter, viewportType), 
      kill: game.kill.bind(game) 
    }
  }

  static willReadFrequently = true
}


let gameloopRequestAnimationFrameId = 0

export const gameloop = (callback: () => void) => {
  let lastTime = millis()  
  const nextFrame = () => {
    gameloopRequestAnimationFrameId = requestAnimationFrame(nextFrame)  
     
    const delta = (millis() - lastTime) * 0.001
    InternalTimeSetter.deltaTime = delta
    FPSCounter.update()
    lastTime = millis()
    
    callback()
  }
  gameloopRequestAnimationFrameId = requestAnimationFrame(nextFrame)
}

export const killgameloop = () => cancelAnimationFrame(gameloopRequestAnimationFrameId)