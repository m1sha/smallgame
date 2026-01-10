import { setPoint, type TPoint, Point } from "../point"
import { Keys } from "../keys/keys"
import { unsafecast } from "../utils"

export type MouseEventTypeNames = | 'MOUSEDOWN' | 'MOUSEUP' | 'MOUSEMOVE' | 'MOUSELEAVE' | 'MOUSEENTER' 
export type MouseWheelEventType = | 'WHEEL'
export type KeyBoardTypeNames = 'KEYDOWN' | 'KEYUP' 

export type GameEventType = KeyBoardTypeNames | MouseEventTypeNames | MouseWheelEventType | 'USEREVENT'

class InputGameEvent<T> {
  readonly altKey: boolean
  readonly ctrlKey: boolean
  readonly metaKey: boolean
  readonly shiftKey: boolean
  readonly origin: T

  constructor(e: KeyboardEvent | MouseEvent) {
    this.altKey = e.altKey
    this.ctrlKey = e.ctrlKey
    this.shiftKey = e.shiftKey
    this.metaKey = e.metaKey
    this.origin = e as any
  }
}

export class KeyboardGameEvent extends InputGameEvent<KeyboardEvent> {
  readonly type: KeyBoardTypeNames
  readonly key: number = 0
  
  constructor (type: KeyBoardTypeNames, e: KeyboardEvent) {
    super(e)
    this.type = type
    this.key = Keys.getKeyCode(e.code)
  }
}

export class MouseButton {
  static readonly NONE = 0
  static readonly LEFT = 1
  static readonly MIDDLE = 3
  static readonly RIGHT = 2
}

export class MouseGameEvent extends InputGameEvent<MouseEvent> {
  readonly type: MouseEventTypeNames
  readonly pos: Point
  readonly shift: Point
  readonly button: number = -1

  constructor (type: MouseEventTypeNames, e: MouseEvent) {
    super(e)
    this.type = type
    this.pos = new Point(e.offsetX,  e.offsetY)
    this.button = e.buttons
    const prevMousePos = unsafecast<any>(e).prevMousePos as TPoint
    this.shift = !prevMousePos 
      ? new Point(0, 0) 
      : new Point(e.offsetX - prevMousePos.x, e.offsetY - prevMousePos.y)
  }

  get lbc () { return this.button === MouseButton.LEFT }
  get rbc () { return this.button === MouseButton.RIGHT }
  get mbc () { return this.button === MouseButton.MIDDLE }
  get cmdKey () { return this.altKey || this.ctrlKey || this.shiftKey || this.metaKey }
}

export class MouseWheelGameEvent extends InputGameEvent<WheelEvent> { 
  readonly type: MouseWheelEventType
  readonly pos: TPoint
  readonly shift: TPoint
  readonly button: number = -1
  readonly deltaMode: number
  readonly deltaX: number
  readonly deltaY: number
  readonly deltaZ: number

  constructor (type: MouseWheelEventType, e: WheelEvent) {
    super(e)
    this.type = type
    this.pos = setPoint(e.offsetX,  e.offsetY)
    this.button = e.buttons
    const prevMousePos = unsafecast<any>(e).prevMousePos as TPoint
    this.shift = !prevMousePos 
      ? setPoint(0, 0) 
      : setPoint(e.offsetX - prevMousePos.x, e.offsetY - prevMousePos.y)

    this.deltaMode = e.deltaMode
    this.deltaX = e.deltaX
    this.deltaY = e.deltaY
    this.deltaZ = e.deltaZ
  }
}

export type GameEvent = KeyboardGameEvent | MouseGameEvent | MouseWheelGameEvent

export class GameEvents {
  private items: GameEvent[] = []
  
  public * get (): Generator<GameEvent>  {
    if (this.items.length > 0)
      yield this.items.shift()!
  }

  has (type: GameEventType) {
    return this.items.some(p => p.type === type)
  }

  push (type: GameEventType, e: Event) {
    switch (type) {
      case 'KEYDOWN': 
      case 'KEYUP':
        this.items.push(new KeyboardGameEvent(type, e as KeyboardEvent))
        break
      case 'MOUSEDOWN': 
      case 'MOUSEUP':
      case 'MOUSEMOVE':
      case 'MOUSELEAVE':
      case 'MOUSEENTER':
        this.items.push(new MouseGameEvent(type, e as MouseEvent))
        break
      case 'WHEEL':
        this.items.push(new MouseWheelGameEvent(type, e as WheelEvent))
        break
    }
  }
}
