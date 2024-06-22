//import { EventQueue } from "../events/event-queue"
import { Key } from "./key"

const keymap: Record<string, number> = {
  'enter': Key.RETURN,
  'space': Key.SPACE,
  'tab': Key.TAB,
  'keya': Key.K_A,
  'keyb': Key.K_B,
  'keyc': Key.K_C,
  'keyd': Key.K_D,
  'keye': Key.K_E,
  'keyf': Key.K_F,
  'keyg': Key.K_G,
  'keyh': Key.K_H,
  'keyi': Key.K_I,
  'keyj': Key.K_J,
  'keyk': Key.K_K,
  'keyl': Key.K_L,
  'keym': Key.K_M,
  'keyn': Key.K_N,
  'keyo': Key.K_O,
  'keyp': Key.K_P,
  'keyq': Key.K_Q,
  'keyr': Key.K_R,
  'keys': Key.K_S,
  'keyt': Key.K_T,
  'keyu': Key.K_U,
  'keyv': Key.K_V,
  'keyw': Key.K_W,
  'keyy': Key.K_Y,
  'keyz': Key.K_Z,
  'digit0': Key.K_0,
  'digit1': Key.K_1,
  'digit2': Key.K_2,
  'digit3': Key.K_3,
  'digit4': Key.K_4,
  'digit5': Key.K_5,
  'digit6': Key.K_6,
  'digit7': Key.K_7,
  'digit8': Key.K_8,
  'digit9': Key.K_9,
  'arrowleft': Key.LEFT,
  'arrowright': Key.RIGHT,
  'arrowup': Key.UP,
  'arrowdown': Key.DOWN,
  'arrowend': Key.END,
  'shiftleft': Key.LSHIFT,
  'shiftright': Key.RSHIFT,
  'altleft': Key.LALT,
  'altright': Key.RALT,
  'controlleft': Key.LCTRL,
  'controlright': Key.RCTRL,
  'insert': Key.INSERT,
  'home': Key.HOME,
  'pageup': Key.PAGEUP,
  'delete': Key.DELETE,
  'end': Key.END,
  'pagedown': Key.PAGEDOWN,
  'numpad0': Key.KP_0,
  'numpad1': Key.KP_1,
  'numpad2': Key.KP_2,
  'numpad3': Key.KP_3,
  'numpad4': Key.KP_4,
  'numpad5': Key.KP_5,
  'numpad6': Key.KP_6,
  'numpad7': Key.KP_7,
  'numpad8': Key.KP_8,
  'numpad9': Key.KP_9,
  'numpaddecimal': Key.KP_PERIOD,
  'numpadenter': Key.KP_ENTER,
  'numpadadd': Key.KP_PLUS,
  'numpadsubtract': Key.KP_MINUS,
  'numpadmultiply': Key.KP_MULTIPLY,
  'numpaddivide': Key.KP_DIVIDE,
  'numlock': Key.NUMLOCK,
  'escape': Key.ESCAPE,
  'backquote': Key.BACKQUOTE,
  'minus': Key.MINUS,
  'equal': Key.EQUALS,
  'backspace': Key.BACKSPACE,
  'f1': Key.F1,
  'f2': Key.F2,
  'f3': Key.F3,
  'f4': Key.F4,
  'f5': Key.F5,
  'f6': Key.F6,
  'f7': Key.F7,
  'f8': Key.F8,
  'f9': Key.F9,
  'f10': Key.F10,
  'f11': Key.F11,
  'f12': Key.F12
}

export class Keys /* implicitly implements EventQueue */ {
  private keys: number[] = []

  constructor () {
    this.keys = new Array(Object.keys(Key).length).fill(0)
  }

  getPressed (): ReadonlyArray<number> {
    return this.keys
  }
  
  /** @internal */ protected /*EventQueue.*/push (e: KeyboardEvent) {
    const code = Keys.getKeyCode(e.code)
    this.keys[code] = 1
    this.keys[Key.ALT] = e.altKey || code === Key.LALT || code === Key.RALT ? 1: 0
    this.keys[Key.CTRL] = e.ctrlKey || code === Key.LCTRL || code === Key.RCTRL ? 1: 0
    this.keys[Key.SHIFT] = e.shiftKey || code === Key.LSHIFT || code === Key.RSHIFT ? 1: 0
    this.keys[Key.META] =  e.metaKey ? 1: 0
  }
  
  /** @internal */ protected /*EventQueue.*/pop (e: KeyboardEvent) {
    const code = Keys.getKeyCode(e.code)
    this.keys[code] = 0
    this.keys[Key.ALT] = 0
    this.keys[Key.CTRL] = 0
    this.keys[Key.SHIFT] = 0
    this.keys[Key.META] =  0
  }

  static getKeyCode (key: string) {
    return keymap[key.toLocaleLowerCase()]
  }
}