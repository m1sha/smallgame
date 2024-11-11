import { Point, TPoint } from "../point"

export function quadratic (p0: Point, p1: Point, p2: Point, t: number): Point {
  const nt = (1 - t)
  const nt2t = nt * 2 * t
  const tSq = t * t  
  const q0 = p0.scale(nt ** 2)
  const q1 = p1.scale(nt2t)
  const q2 = p2.scale(tSq)
  return q0.shiftSelf(q1.shiftSelf(q2))
}

export function cubic (p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const nt = (1 - t)
  const ntSq = nt ** 2
  const ntCb = ntSq * nt
  const q0 = p0.scale(ntCb)
  const q1 = p1.scale(ntSq * 3 * t)
  const q2 = p2.scale(nt * 3 * t ** 2)
  const q3 = p3.scale(t ** 3)
  const r = q0.shiftSelf(q1).shiftSelf(q2).shiftSelf(q3)
  return r
}

export function makeQuadraticCurve (p0: Point, p1: Point, p2: Point, n: number): Point[] {
  const result: Point[] = []
  const d = 1.0 / n
  let t = d
  while (t < 1.0) {
    result.push(quadratic(p0, p1, p2, t))
    t += d
  }
  return result
}

export function makeCubicCurve (p0: Point, p1: Point, p2: Point, p3: Point, n: number): Point[] {
  const result: Point[] = []
  const d = 1.0 / n
  let t = d
  while (t < 1.0) {
    result.push(cubic(p0, p1, p2, p3, t))
    t += d
  }
  return result
}

// export class CubicBezier {
//   readonly #p1: Point
//   readonly #p2: Point
//   readonly #p0: Point 
//   readonly #p3: Point

//   constructor (p1: TPoint, p2: TPoint)
//   constructor (x1: number, y1: number, x2: number, y2: number)
//   constructor (...args: Array<any>) {
//     this.#p0 = Point.zero
//     this.#p3 = Point.one
//     if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number' && typeof args[3] === 'number') {
//       this.#p1 = new Point(args[0], args[1])
//       this.#p2 = new Point(args[2], args[3])
//       return
//     }

//     if (args.length === 2 && args[0] && typeof args[0] === 'object' && args[1] && typeof args[1] === 'object' ) {
//       this.#p1 = new Point(args[0].x, args[0].y)
//       this.#p2 = new Point(args[1].x, args[1].y)
//       return
//     }
    
//     throw new Error('unsupported arguments.')
//   }

//   getPoint (t: number): Point {
//     return cubic(this.#p0, this.#p1, this.#p2, this.#p3, t)
//   }

//   get p1 (): Readonly<TPoint> { return this.#p1 }
//   get p2 (): Readonly<TPoint> { return this.#p2 }

//   static #ease = new CubicBezier(0.25, 0.1, 0.25, 1)
//   static get ease () {
//     return this.#ease
//   }

//   static #linear = new CubicBezier(0.0, 0.0, 1, 1)
//   static get linear () {
//     return this.#linear
//   }

//   static #easeIn = new CubicBezier(0.42, 0, 1, 1)
//   static get easeIn () {
//     return this.#easeIn
//   }

//   static #easeOut = new CubicBezier(0, 0, 0.58, 1)
//   static get easeOut () {
//     return this.#easeOut
//   }

//   static #easeInOut = new CubicBezier(0.42, 0, 0.58, 1)
//   static get easeInOut () {
//     return this.#easeInOut
//   }
// }