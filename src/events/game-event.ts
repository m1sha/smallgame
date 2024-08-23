import { Keys } from "../keys/keys"

export type MouseEventTypeNames = | 'MOUSEDOWN' | 'MOUSEUP' | 'MOUSEMOVE' | 'MOUSELEAVE' | 'MOUSEENTER'
export type KeyBoardTypeNames = 'KEYDOWN' | 'KEYUP' 

export type GameEventType = KeyBoardTypeNames | MouseEventTypeNames | 'USEREVENT'

class InputGameEvent<T> {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  origin: T

  constructor(e: KeyboardEvent | MouseEvent) {
    this.altKey = e.altKey
    this.ctrlKey = e.ctrlKey
    this.metaKey = e.metaKey
    this.origin = e as any
  }
}

export class KeyboardGameEvent extends InputGameEvent<KeyboardEvent> {
  type: KeyBoardTypeNames
  key: number = 0
  
  constructor (type: KeyBoardTypeNames, e: KeyboardEvent) {
    super(e)
    this.type = type
    this.key = Keys.getKeyCode(e.code)
  }
}

export class MouseGameEvent extends InputGameEvent<MouseEvent> {
  type: MouseEventTypeNames
  pos: { x: number, y: number}
  button: number = -1
  constructor (type: MouseEventTypeNames, e: MouseEvent) {
    super(e)
    this.type = type
    this.pos = { x: e.offsetX, y: e.offsetY }
    this.button = e.buttons
  }
}

export type GameEvent =  KeyboardGameEvent |  MouseGameEvent

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
