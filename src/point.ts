export type TPoint = { x: number, y: number }

export class Point {
  x: number
  y: number
  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  static get zero () { return new Point(0, 0) }
}