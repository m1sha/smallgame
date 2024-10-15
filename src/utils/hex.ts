import { Rect } from "../rect"
import { setPoint, TPoint } from "../point"

export type HexagonOrientation = 'flat' | 'pointy'

export class Hex {
  #points: TPoint[]
  #x: number
  #y: number
  #size: number
  #orientation: HexagonOrientation
  
  constructor (x: number, y: number, size: number, orientation: HexagonOrientation = 'flat') {
    this.#x = x
    this.#y = y
    this.#size = size
    this.#orientation = orientation
    this.#points = new Array(6)
    this.calcPoints()
  }

  get a () { return this.#points[0] }
  get b () { return this.#points[1] }
  get c () { return this.#points[2] }
  get d () { return this.#points[3] }
  get e () { return this.#points[4] }
  get f () { return this.#points[5] }

  get x () { return this.#x }
  set x (value: number) {
    this.#x = value
    this.calcPoints()
  }

  get y () { return this.#y }
  set y (value: number) {
    this.#y = value
    this.calcPoints()
  }

  get width (): number {
    return this.orientation === 'flat' ? this.size * 2 : this.size * 1.732050807568877
  }

  get height (): number {
    return this.orientation === 'pointy' ? this.size * 2 : this.size * 1.732050807568877
  }

  get bounds (): Rect {
    const { width, height } = this
    return new Rect(this.x - width / 2, this.y - height / 2, width, height)
  }

  offset (): Readonly<TPoint> {
    return this.#orientation === 'flat' 
      ? setPoint(this.size * 1.5, this.size * 1.732050807568877)
      : setPoint(this.size * 1.732050807568877, this.size * 1.5)
  }

  get size () { return this.#size }
  set size (value: number) {
    this.#size = value
    this.calcPoints()
  }

  get orientation () { return this.#orientation }
  set orientation (value: HexagonOrientation) {
    this.#orientation = value
    this.calcPoints()
  }

  get points (): TPoint[] { return this.#points }

  private calcPoints() {
    const x = this.#x
    const y = this.#y
    const s = this.#size
    const s1_2 = s * 0.5
    const s3_2 = s * 0.8660254037844386

    if (this.#orientation === 'flat') {
      this.#points[0] = setPoint(x + s   , y)
      this.#points[1] = setPoint(x + s1_2, y - s3_2)
      this.#points[2] = setPoint(x - s1_2, y - s3_2)
      this.#points[3] = setPoint(x - s   , y)
      this.#points[4] = setPoint(x - s1_2, y + s3_2)
      this.#points[5] = setPoint(x + s1_2, y + s3_2)
    } else {
      this.#points[0] = setPoint(x + s3_2, y + s1_2)
      this.#points[1] = setPoint(x,        y + s)
      this.#points[2] = setPoint(x - s3_2, y + s1_2)
      this.#points[3] = setPoint(x - s3_2, y - s1_2)
      this.#points[4] = setPoint(x,        y - s)
      this.#points[5] = setPoint(x + s3_2, y - s1_2)
    }
  }

  static offset (row: number, col: number, size: number, orientation: HexagonOrientation): Readonly<TPoint> {
    const offset = col % 2 ? 0: size * 0.8660254037844386
    return orientation === 'flat' 
      ? setPoint(col * size * 1.5, row * size * 1.732050807568877 + offset)
      : setPoint(row * size * 1.732050807568877 + offset, col * size * 1.5)
  }
}
