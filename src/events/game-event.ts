import { setPoint, TPoint } from "../point"
import { Keys } from "../keys/keys"
import { unsafecast } from "../utils"

export type MouseEventTypeNames = | 'MOUSEDOWN' | 'MOUSEUP' | 'MOUSEMOVE' | 'MOUSELEAVE' | 'MOUSEENTER'
export type KeyBoardTypeNames = 'KEYDOWN' | 'KEYUP' 

export type GameEventType = KeyBoardTypeNames | MouseEventTypeNames | 'USEREVENT'

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

export class MouseGameEvent extends InputGameEvent<MouseEvent> {
  readonly type: MouseEventTypeNames
  readonly pos: TPoint
  readonly shift: TPoint
  readonly button: number = -1

  constructor (type: MouseEventTypeNames, e: MouseEvent) {
    super(e)
    this.type = type
    this.pos = setPoint(e.offsetX,  e.offsetY)
    this.button = e.buttons
    const prevMousePos = unsafecast<any>(e).prevMousePos as TPoint
    this.shift = !prevMousePos 
      ? setPoint(0, 0) 
      : setPoint(e.offsetX - prevMousePos.x, e.offsetY - prevMousePos.y)
  }
}

export type GameEvent = KeyboardGameEvent | MouseGameEvent

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
    }
  }
}
