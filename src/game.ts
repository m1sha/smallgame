import { Surface } from "./surface"
import { EventController } from "./events/event-controller"
import { GameEvents } from "./events/game-event"
import { Keys } from "./keys/keys"

export class Game {
  readonly event: GameEvents
  readonly key: Keys
  private readonly controller: EventController 
  private screen: Surface | null = null
  
  constructor () {
    this.event = new GameEvents()
    this.key = new Keys
    this.controller = new EventController()
    this.controller.init(this.event, this.key)
  }

  init (width: number, height: number, containter: HTMLElement): Surface {
    this.screen = new Surface(width, height)
    containter.append(this.screen.draw.canvas as any)
    return this.screen
  }

  loop (callback: () => void): void {
    callback()
    
    requestAnimationFrame(() => {
      this.loop(callback)
    })
  }
}