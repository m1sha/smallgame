import { Keys } from "../keys/keys"
import { GameEvents } from "./game-event"
import { unsafecast } from "../utils"
import { EventQueue } from "./event-queue"

export class EventController {
  init (events: GameEvents, keys: Keys) {
    let keypressed = false
    const queue = unsafecast<EventQueue>(keys)

    document.addEventListener('keydown', e => {
      e.preventDefault()
      
      queue.push(e)
      if (keypressed) return
      keypressed = true
      events.push('KEYDOWN', e)

      console.log(e.code)
    })

    document.addEventListener('keyup', e => {
      e.preventDefault()
      queue.pop(e)
      if (!keypressed) return
      keypressed = false
      events.push('KEYUP', e)
    })

  }
}
