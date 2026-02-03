import { TSize } from "../size"
import { Rect, TRect } from "../rect"
import { uniformRandomScatter } from "./uniform-random-scatter"

const Random = {
  uniformRandomScatter: <T extends { rect: Rect }>(fieldSize: TSize | TRect, objecs: T[]): void => uniformRandomScatter(fieldSize, objecs),
  betweeni: (min: number, max: number) => (0 | (Math.random() * max)) + min
}

export { Random }