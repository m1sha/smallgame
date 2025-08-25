import { type TPoint } from "../point"
import { type Pivote } from "../pivote"
import { type TRect } from "../rect"

export type TFlip = 'none' | 'x' | 'y' | 'xy'
export type TRotation = { angle: number, pivote?: Pivote | TPoint }

export type TBlitOptions = {
  flip?: TFlip
  rotation?: TRotation
  srcRect?: TRect
}

