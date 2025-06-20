import { unsafecast } from "../utils"
import { type EventQueue } from "./event-queue"
import { Point } from "../point"
import { EventControllerOptions, type TEventControllerOptions } from "./event-controller-options"
import { GameEvents } from "./game-event"
import { Keys } from "../keys/keys"

export class EventController {
  private htmlContainter: HTMLElement | null
  private listeners: { name: string, callback: (e: any) => void}[]
  private readonly options: EventControllerOptions
  private readonly queue: EventQueue
  private readonly prevMousePos = Point.zero
  private keypressed = false
  private mousemown = false
  private leave = true
  private lastKey = ''
  readonly event: GameEvents
  readonly key: Keys
  
  callback: (() => void) | null = null

  constructor (options?: TEventControllerOptions) {
    this.htmlContainter = null
    this.listeners = []
    this.event = new GameEvents()
    this.key = new Keys
    this.options = new EventControllerOptions(options)
    this.queue = unsafecast<EventQueue>(this.key)
  }

  init (htmlContainter: HTMLElement) {
    this.htmlContainter = htmlContainter
    this.listeners.push({ name: 'keydown', callback: this.keydown.bind(this) })
    this.listeners.push({ name: 'keyup', callback: this.keyup.bind(this) })
    this.listeners.push({ name: 'pointerdown', callback: this.pointerdown.bind(this) })
    this.listeners.push({ name: 'pointerup', callback: this.pointerup.bind(this) })
    this.listeners.push({ name: 'pointermove', callback: this.pointermove.bind(this) })
    this.listeners.push({ name: 'pointerleave', callback: this.pointerleave.bind(this) })
    this.listeners.push({ name: 'pointercancel', callback: this.pointerleave.bind(this) })
    this.listeners.push({ name: 'pointerout', callback: this.pointerleave.bind(this) })
    this.listeners.push({ name: 'pointerover', callback: this.pointerenter.bind(this) })
    this.listeners.push({ name: 'pointerenter', callback: this.pointerenter.bind(this) })
    this.listeners.push({ name: 'wheel', callback: this.wheel.bind(this) })
    this.activateListeners(htmlContainter)
  }

  claerListeners () {
    if (!this.htmlContainter) return
    
    const htmlContainter = this.htmlContainter
    this.listeners.forEach(listener => {
      if (['keydown', 'keyup'].includes(listener.name)) {
        document.removeEventListener(listener.name, listener.callback)
        return
      }

      htmlContainter.removeEventListener(listener.name, listener.callback)
    })
    this.listeners = []
  }

  private activateListeners (htmlContainter: HTMLElement) { 
    this.listeners.forEach(listener => {
      if (['keydown', 'keyup'].includes(listener.name)) {
        document.addEventListener(listener.name, listener.callback)
        return
      }
      htmlContainter.addEventListener(listener.name, listener.callback)
    })
  }

  private keydown (e: KeyboardEvent) {
    if (!this.options.canPressKey(this.htmlContainter!)) return
      
    this.queue.push(e)

    if (this.keypressed && this.lastKey === e.key) return
      
    this.keypressed = true
    this.lastKey = e.key
    this.event.push('KEYDOWN', e)
    if (this.callback) this.callback()
  }

  private keyup (e: KeyboardEvent) {
    if (!this.options.canPressKey(this.htmlContainter!)) return

    this.queue.pop(e)

    if (!this.keypressed) return
    this.keypressed = false
    this.event.push('KEYUP', e)
    this.prevMousePos.moveSelf(0, 0)
    if (this.callback) this.callback()
  }

  private pointerdown (e: PointerEvent) {
    this.leave = false

    if (this.mousemown) return
    this.mousemown = true
    this.event.push('MOUSEDOWN', e)
    if (this.callback) this.callback()
  }

  private pointerup (e: PointerEvent) {
    this.leave = false

    if (!this.mousemown) return
    this.mousemown = false
    this.event.push('MOUSEUP', e)
    if (this.callback) this.callback()
  }

  private pointermove (e: PointerEvent) {
    this.leave = false
    const ev = e as any
    ev.prevMousePos = this.prevMousePos

    if (this.event.has('MOUSEMOVE')) {
      return
    }

    if (e instanceof PointerEvent) {
      if (e.pointerType === 'pen')
      if (e.getCoalescedEvents) {
        const events = e.getCoalescedEvents()
        console.dir(events)
        for (const ev of events)
          this.event.push('MOUSEMOVE', ev)
        
        //if (this.callback) this.callback()
        return
      }
    }

    this.event.push('MOUSEMOVE', e)
    if (this.callback) this.callback()
    this.prevMousePos.moveSelf(ev.offsetX, ev.offsetY)
  }

  private pointerleave (e: PointerEvent) {
    if (this.leave) return
    this.event.push('MOUSELEAVE', e)
    if (this.callback) this.callback()
    this.leave = true
    this.prevMousePos.moveSelf(0, 0)
  }
 
  private pointerenter (e: PointerEvent) {
    if (!this.leave) return
    this.options.setTarget(this.htmlContainter!, 'mouseenter')
    this.event.push('MOUSEENTER', e)
    if (this.callback) this.callback()
    this.leave = false
    this.prevMousePos.moveSelf(0, 0)
  }

  private wheel (e: WheelEvent) {
    this.event.push('WHEEL', e)
    if (this.callback) this.callback()
  }
}
