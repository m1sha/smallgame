import { unsafecast } from "../utils"
import { EventQueue } from "./event-queue"
import { Point } from "../point"
import { IEventProvider } from "./event-provider"

export class EventController {
  private readonly eventProvider: IEventProvider
  callback: (() => void) | null = null

  constructor (provider: IEventProvider) {
    this.eventProvider = provider
  }

  init (htmlContainter: HTMLElement) {
    const { event, key } = this.eventProvider
    let keypressed = false
    let mousemown = false
    const queue = unsafecast<EventQueue>(key)
    let leave = true
    const prevMousePos = Point.zero
    let lastKey = ''

    document.addEventListener('keydown', e => {
      queue.push(e)

      if (keypressed && lastKey === e.key) return
      
      keypressed = true
      lastKey = e.key
      event.push('KEYDOWN', e)
      if (this.callback) this.callback()
    })

    document.addEventListener('keyup', e => {
      queue.pop(e)

      if (!keypressed) return
      keypressed = false
      event.push('KEYUP', e)
      prevMousePos.moveSelf(0, 0)
      if (this.callback) this.callback()
    })

    htmlContainter.addEventListener('pointerdown', e => {
      leave = false

      if (mousemown) return
      mousemown = true
      event.push('MOUSEDOWN', e)
      if (this.callback) this.callback()
    })

    htmlContainter.addEventListener('pointerup', e => {
      leave = false

      if (!mousemown) return
      mousemown = false
      event.push('MOUSEUP', e)
      if (this.callback) this.callback()
    })

    htmlContainter.addEventListener('pointermove', e => {
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
          
          if (this.callback) this.callback()
          return
        }
      }

      event.push('MOUSEMOVE', e)
      prevMousePos.moveSelf(ev.offsetX, ev.offsetY)
      if (this.callback) this.callback()
    })

    htmlContainter.addEventListener('pointerleave', e => {
      if (leave) return
      event.push('MOUSELEAVE', e)
      leave = true
      prevMousePos.moveSelf(0, 0)
      if (this.callback) this.callback()
    })

    htmlContainter.addEventListener('pointercancel', e => {
      if (leave) return
      event.push('MOUSELEAVE', e)
      leave = true
      prevMousePos.moveSelf(0, 0)
      if (this.callback) this.callback()
    })

    htmlContainter.addEventListener('pointerout', e => {
      if (leave) return
      event.push('MOUSELEAVE', e)
      leave = true
      prevMousePos.moveSelf(0, 0)
      if (this.callback) this.callback()
    })

    htmlContainter.addEventListener('pointerover', e => {
      if (!leave) return
      event.push('MOUSEENTER', e)
      leave = false
      prevMousePos.moveSelf(0, 0)
      if (this.callback) this.callback()
    })
    
    htmlContainter.addEventListener('pointerenter', e => {
      if (!leave) return
      event.push('MOUSEENTER', e)
      leave = false
      prevMousePos.moveSelf(0, 0)
      if (this.callback) this.callback()
    })
  }
}
