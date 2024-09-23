import { setPoint } from "./point"

export type CoordinateSystem = 'screen' | 'math'


const fromMathCoord = (x: number, y: number, half_width: number, half_height: number) => (
  setPoint((x + 1) * half_width, (-y + 1) * half_height)
)

const fromScreenCoord = (x: number, y: number, half_width: number, half_height: number) => (
  setPoint(x / half_width - 1,  y / half_height - 1)
)

export { fromMathCoord, fromScreenCoord }
