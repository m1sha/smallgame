import { TPoint } from "./point"

export type TVector = TPoint

export class Vector {
  x: number
  y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  get magnitude () {
    return Math.sqrt(this.dot(this))
  }

  get magnitudeSqr () {
    return this.dot(this)
  }

  dot (vec: TVector) {
    return Vector.dot(this, vec)
  }

  scale (vec: TVector) {
    return Vector.scale(this, vec)
  }

  scaleSelf (vec: TVector) {
    return this
  }

  normalize () {
    return normalize(this)
  }

  normalizeSelf () {
    const { x, y } = normalize(this)
    this.x = x; this.y = y
    return this
  }

  static dot (vec0: TVector, vec1: TVector): number {
    return dot(vec0, vec1)
  }

  static scale (vec0: TVector, vec1: TVector): Vector {
    return new Vector(vec0.x * vec1.x, vec0.y * vec1.y)
  }
}

export function setVector (x: number, y: number): TVector {
  return { x, y }
}

export function resetVector (vec: TVector, x: number, y: number): void {
  vec.x = x; vec.y = y
}

export function dot (vec0: TVector, vec1: TVector): number {
  return vec0.x * vec1.x + vec0.y * vec1.y
}

export function scale (vec0: TVector, vec1: TVector): TVector {
  return setVector(vec0.x * vec1.x, vec0.y * vec1.y)
}

export function normalize (vec: TVector): TVector {
  return { 
    x: vec.x / Math.abs(vec.x === 0 ? 1 : vec.x), 
    y: vec.y / Math.abs(vec.y === 0 ? 1 : vec.y) 
  }
}

export function vecdir (vec0: TVector, vec1: TVector): TVector {
  return { x: vec1.x - vec0.x, y: vec1.y - vec0.y}
}