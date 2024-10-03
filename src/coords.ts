import { setPoint, TPoint } from "./point"

export type CoordinateSystem = 'screen' | 'math' | 'cartesian'


const fromMathCoord = (x: number, y: number, half_width: number, half_height: number) => (
  setPoint((x + 1) * half_width, (-y + 1) * half_height)
)

const fromScreenCoord = (x: number, y: number, half_width: number, half_height: number) => (
  setPoint(x / half_width - 1,  y / half_height - 1)
)

const fromCartesianCoord = (x: number, y: number, half_width: number, half_height: number) => (
  setPoint(x + half_width, half_height - y)
)

const coordconv = (sys: CoordinateSystem, point: TPoint, width: number, height: number): TPoint => {
  switch (sys) {
    case "screen": return point
    case "math": return fromMathCoord(point.x, point.y, width / 2, height / 2)
    case "cartesian": return fromCartesianCoord(point.x, point.y, width / 2, height / 2)
  }
}

export { fromMathCoord, fromScreenCoord, fromCartesianCoord, coordconv }
