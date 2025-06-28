import { fromString } from "./imports/from-string";

export class Color {
  #rgba: Float32Array
  
  constructor (rgb: number)
  constructor (rgb: [number, number, number])
  constructor (rgba: [number, number, number, number])
  constructor (r: number, g: number, b: number, a?: number)
  constructor (...args: Array<any>) {
    let r = 0.0, g = 0.0, b = 0.0, a = 0.0
    
    if (args.length >= 3 && typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number') {
      r = args[0]; g = args[1]; b = args[2]
      a = typeof args[3] === 'number' ? a : 0.0
    } else if (args.length === 1 && typeof args[0] === 'number') {
      r = args[0]; g = args[0]; b = args[0]
    } else if (args.length === 1 && Array.isArray(args[0]) && typeof args[0][0] === 'number' && typeof args[0][1] === 'number' && typeof args[0][2] === 'number') {
      r = args[0][0]; g = args[0][1]; b = args[0][2]
      a = typeof args[0][3] === 'number' ? a : 0.0
    }

    if (r < 0.0 || r > 1.0) throw Error('the R value must be between 0.0 and 1.0.')
    if (g < 0.0 || g > 1.0) throw Error('the G value must be between 0.0 and 1.0.')
    if (b < 0.0 || b > 1.0) throw Error('the B value must be between 0.0 and 1.0.')
    if (typeof a === 'number' && (a < 0.0 || a > 1.0)) throw Error('the A component value must be between 0.0 and 1.0.')
    
    this.#rgba = new Float32Array(4)
    this.#rgba[0] = r
    this.#rgba[1] = g
    this.#rgba[2] = b
    this.#rgba[3] = typeof a === 'number' ? a : 1.0
  }

  add (a: Color) {
    this.#rgba[0] = this.trunc(this.#rgba[0] + a.#rgba[0])
    this.#rgba[1] = this.trunc(this.#rgba[1] + a.#rgba[1])
    this.#rgba[2] = this.trunc(this.#rgba[2] + a.#rgba[2])
  }

  sub (a: Color) {
    this.#rgba[0] = this.trunc(this.#rgba[0] - a.#rgba[0])
    this.#rgba[1] = this.trunc(this.#rgba[1] - a.#rgba[1])
    this.#rgba[2] = this.trunc(this.#rgba[2] - a.#rgba[2])
  }

  mul (a: Color) {
    this.#rgba[0] = this.trunc(this.#rgba[0] * a.#rgba[0])
    this.#rgba[1] = this.trunc(this.#rgba[1] * a.#rgba[1])
    this.#rgba[2] = this.trunc(this.#rgba[2] * a.#rgba[2])
  }

  div (a: Color) {
    this.#rgba[0] = this.trunc(this.#rgba[0] / a.#rgba[0])
    this.#rgba[1] = this.trunc(this.#rgba[1] / a.#rgba[1])
    this.#rgba[2] = this.trunc(this.#rgba[2] / a.#rgba[2])
  }

  pow (a: number) {
    this.#rgba[0] = this.trunc(Math.pow(this.#rgba[0], a))
    this.#rgba[1] = this.trunc(Math.pow(this.#rgba[1], a))
    this.#rgba[2] = this.trunc(Math.pow(this.#rgba[2], a))
  }

  invert () {
    this.#rgba[0] = 1.0 - this.#rgba[0]
    this.#rgba[1] = 1.0 - this.#rgba[1]
    this.#rgba[2] = 1.0 - this.#rgba[2]
  }

  mix (color: Color, value: number) {
    this.#rgba[0] = this.trunc(this.#rgba[0] * (1.0 - value) + color.#rgba[0] * value)
    this.#rgba[1] = this.trunc(this.#rgba[1] * (1.0 - value) + color.#rgba[1] * value)
    this.#rgba[2] = this.trunc(this.#rgba[2] * (1.0 - value) + color.#rgba[2] * value)
  }

  value () {
    return this.#rgba
  }

  toString () {
    if (typeof this.#rgba[3] === 'number') {
      const conv = (v: number) => (0 | v * 255).toString(10)
      return `rgba(${conv(this.#rgba[0])},${conv(this.#rgba[1])},${conv(this.#rgba[2])},${conv(this.#rgba[3])})`
    }
    const conv = (v: number) => (0 | v * 255).toString(16).padStart(2, '0')
    return `#${conv(this.#rgba[0])}${conv(this.#rgba[1])}${conv(this.#rgba[2])}`
  }


  private trunc (value: number) {
    if (value < 0.0) return 0.0
    if (value > 1.0) return 1.0
    return value
  }

  static from (...args: Array<any>): Color {
    
    if (typeof args[0] === 'string') {
      return new Color(fromString(args[0]))
    }

    return new Color(0.0, 0.0, 0.0, 0.0)
  }

  static get black () { return Color.from('#000') }
  static get silver () { return Color.from('#c0c0c0') }
  static get gray () { return Color.from('#808080') }
  static get white () { return Color.from('#fff') }
  static get maroon () { return Color.from('#800000') }
  static get red () { return Color.from('#ff0000') }
  static get purple () { return Color.from('#800080') }
  static get fuchsia () { return Color.from('#FF00FF') }
  static get green () { return Color.from('#008000') }
  static get lime () { return Color.from('#00FF00') }
  static get olive () { return Color.from('#808000') }
  static get yellow () { return Color.from('#FFFF00') }
  static get navy () { return Color.from('#000080') }
  static get blue () { return Color.from('#0000FF') }
  static get teal () { return Color.from('#008080') }
  static get aqua () { return Color.from('#00FFFF') }
  
}