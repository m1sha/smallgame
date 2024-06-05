import { Keys } from "../keys/keys"
import { GameEvents } from "./game-event"
import { unsafecast } from "../utils"

export class EventController {
  init (events: GameEvents, keys: Keys) {
    
    let keypressed = false

    const k = unsafecast<{
      push: (e: KeyboardEvent) => void,
      clear: () => void
    }>(keys)

    document.addEventListener('keydown', e => {
      e.preventDefault()
      
      k.push(e)
      if (keypressed) return
      keypressed = true
      events.push('KEYDOWN', e)

      console.log(e.code)
    })

    document.addEventListener('keyup', e => {
      e.preventDefault()
      
      k.clear()
      if (!keypressed) return
      keypressed = false
      events.push('KEYUP', e)
    })

  }
}
