import { Point, TPoint } from "../../point"

export class M33 {

  constructor (private matrix: DOMMatrix = new DOMMatrix()) {
  }

  static get I () { return new M33() }

  rotate (deg: number, target?: TPoint) {
    return M33.I.rotateSelf(deg, target)
  }

  rotateSelf (deg: number, target?: TPoint) { 
    if (target) {
      this.matrix
        .translateSelf(target.x, target.y)
        .rotateSelf(deg)
        .translateSelf(-target.x, -target.y)
      return this
    }

    this.matrix.rotateSelf(deg)
    return this
  }

  mul (m: M33) {
    return new M33(this.matrix.multiply(m.matrix))
  }

  mulSelf (m: M33) {
    this.matrix.multiplySelf(m.matrix)
    return this
  }

  applyToPoint (point?: TPoint) {
    return Point.from(this.matrix.transformPoint(point))
  }

  static rotate (deg: number, target?: TPoint) {
    return M33.I.rotateSelf(deg, target)
  }

  static mul (m: M33, m2: M33) { 
    return m.mul(m2)
  }
}

