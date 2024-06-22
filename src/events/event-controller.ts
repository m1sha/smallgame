import { unsafecast } from "../utils"
import { EventQueue } from "./event-queue"
import { Game } from "../game"
import { Surface } from "../surface"

export class EventController {
  private readonly game: Game

  constructor (game: Game) {
    this.game = game
  }

  init (screen: Surface) {
    const { event, key } = this.game
    let keypressed = false
    let mousemown = false
    const queue = unsafecast<EventQueue>(key)

    document.addEventListener('keydown', e => {
      queue.push(e)

      if (keypressed) return
      keypressed = true
      event.push('KEYDOWN', e)
    })

    document.addEventListener('keyup', e => {
      queue.pop(e)

      if (!keypressed) return
      keypressed = false
      event.push('KEYUP', e)
    })

    const canvas = screen.draw.canvas

    canvas.addEventListener('mousedown', e => {
      if (mousemown) return
      mousemown = true
      event.push('MOUSEDOWN', e)
    })

    canvas.addEventListener('mouseup', e => {
      if (!mousemown) return
      mousemown = false
      event.push('MOUSEUP', e)
    })

    canvas.addEventListener('mousemove', e => {
      if (event.has('MOUSEMOVE')) return
      event.push('MOUSEMOVE', e)
    })

  }
}
