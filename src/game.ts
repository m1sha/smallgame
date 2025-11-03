import { Screen } from "./screen"
import { EventController, GameEvents } from "./events"
import { Keys } from "./keys/keys"
import { InternalTimeSetter } from "./time"
import { type ViewportType } from "./viewport"
import { FPSCounter, millis } from "./utils"
import { type CoordinateSystem } from "./coords"

export type InitCreateOptions = {
  viewportType?: ViewportType
  willReadFrequently?: boolean
  coordinateSystem?: CoordinateSystem
}

export class Game {
  private readonly controller: EventController 
  #screen: Screen | null = null
  
  constructor () {
    this.controller = new EventController()
  }

  get event (): GameEvents { return this.controller.event }
  get key (): Keys { return this.controller.key }
  get screen (): Screen { return this.screen }

  private init (width: number, height: number, containter: HTMLElement, viewportType: ViewportType = 'transform', coordinateSystem?: CoordinateSystem): Screen {
    if (this.#screen) return this.#screen
    this.#screen = new Screen(viewportType, width, height, { coordinateSystem: coordinateSystem })
    const htmlContainer = this.#screen.viewport.htmlContainer as any
    containter.append(htmlContainer)
    this.controller.init(htmlContainer)
    return this.#screen
  }

  kill () {
    this.#screen?.dispose()
    this.controller.claerListeners()
  }

  [Symbol.dispose]() {
    this.kill()
  }

  static create (width: number, height: number, containter: HTMLElement, options?: InitCreateOptions) {
    Game.willReadFrequently = options && options.willReadFrequently ? options.willReadFrequently : true
    const viewportType = options && options.viewportType ? options.viewportType : 'transform'
    const coordinateSystem = options && options.coordinateSystem ? options.coordinateSystem : 'screen'
    const game = new Game()
    return { 
      game, 
      screen: game.init(width, height, containter, viewportType, coordinateSystem), 
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