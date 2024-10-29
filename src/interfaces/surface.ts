import { Rect } from "../rect"

export interface ISurface {
  get rect (): Rect
  get width(): number
  get height (): number
}