import { unsafecast } from "../utils"
import { EventQueue } from "./event-queue"
import { Game } from "../game"
import { Surface } from "../surface"
import { Point } from "../point"

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
    let leave = true
    const prevMousePos = Point.zero

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
      prevMousePos.moveSelf(0, 0)
    })

    const canvas = screen.draw.canvas

    canvas.addEventListener('pointerdown', e => {
      leave = false

      if (mousemown) return
      mousemown = true
      event.push('MOUSEDOWN', e)
    })

    canvas.addEventListener('pointerup', e => {
      leave = false

      if (!mousemown) return
      mousemown = false
      event.push('MOUSEUP', e)
    })

    canvas.addEventListener('pointermove', e => {
      leave = false
      const ev = e as any
      ev.prevMousePos = prevMousePos

      if (event.has('MOUSEMOVE')) {
        return
      }

      if (e instanceof PointerEvent) {
        if (e.pointerType === 'pen')
        if (e.getCoalescedEvents) {
          const events = e.getCoalescedEvents()
          console.dir(events)
          for (const ev of events)
            event.push('MOUSEMOVE', ev)
          
          return
        }
      }

      event.push('MOUSEMOVE', e)
      prevMousePos.moveSelf(ev.offsetX, ev.offsetY)
    })

    canvas.addEventListener('pointerleave', e => {
      if (leave) return
      event.push('MOUSELEAVE', e)
      leave = true
      prevMousePos.moveSelf(0, 0)
    })

    canvas.addEventListener('pointercancel', e => {
      if (leave) return
      event.push('MOUSELEAVE', e)
      leave = true
      prevMousePos.moveSelf(0, 0)
    })

    canvas.addEventListener('pointerout', e => {
      if (leave) return
      event.push('MOUSELEAVE', e)
      leave = true
      prevMousePos.moveSelf(0, 0)
    })

    canvas.addEventListener('pointerover', e => {
      if (!leave) return
      event.push('MOUSEENTER', e)
      leave = false
      prevMousePos.moveSelf(0, 0)
    })
    
    canvas.addEventListener('pointerenter', e => {
      if (!leave) return
      event.push('MOUSEENTER', e)
      leave = false
      prevMousePos.moveSelf(0, 0)
    })
  }
}
