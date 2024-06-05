import { Keys } from "../keys/keys"

type GameEventType = 'KEYDOWN' | 'KEYUP' | 'USEREVENT' | 'MOUSEDOWN' | 'MOUSEUP' | 'MOUSEMOVE'

class KeyboardGameEvent {
  type: 'KEYDOWN' | 'KEYUP'
  key: number = 0
  
  constructor (type: 'KEYDOWN' | 'KEYUP', e: KeyboardEvent) {
    this.type = type
    this.key = Keys.getKeyCode(e.code)
  }
}

class MouseGameEvent {
  type: 'MOUSEDOWN' | 'MOUSEUP' | 'MOUSEMOVE'
  pos: { x: number, y: number}
  constructor (type: 'MOUSEDOWN' | 'MOUSEUP' | 'MOUSEMOVE', e: MouseEvent) {
    this.type = type
    this.pos = { x: e.offsetX, y: e.offsetY }
  }
}

export type GameEvent =  KeyboardGameEvent |  MouseGameEvent

export class GameEvents {
  private items: GameEvent[] = []
  
  public * get (): Generator<GameEvent>  {
    if (this.items.length > 0)
      yield this.items.shift()!
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
        this.items.push(new MouseGameEvent(type, e as MouseEvent))
        break
    }
  }
}
