import { Rect } from "../rect"
import { Surface } from "./surface"

export type CombinedSurface = {
  surface: Surface
  rects: Rect[]
}