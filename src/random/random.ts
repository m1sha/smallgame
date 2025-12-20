import { TSize } from "../size"
import { Rect, TRect } from "../rect"
import { uniformRandomScatter } from "./uniform-random-scatter"

const Random = {
  uniformRandomScatter: <T extends { rect: Rect }>(fieldSize: TSize | TRect, objecs: T[]): void => uniformRandomScatter(fieldSize, objecs)
}

export { Random }