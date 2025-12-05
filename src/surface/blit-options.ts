import { TPoint } from "../point"
import { Pivote } from "../pivote"
import { TRect } from "../rect"

export type TBlitOptions = {
  angle?: number
  pivote?: Pivote | TPoint
  pivoteOwner?: 'self' | 'source'
  zoom?: number
  shift?: TPoint
  transform?: DOMMatrix
  distRect?: TRect
}
