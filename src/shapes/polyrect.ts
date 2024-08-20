import { TPoint } from "../point"

export type PolyRectangle = {
  type: 'polyrectangle'
  topLeft: TPoint
  topRight: TPoint
  bottomLeft: TPoint
  bottomRight: TPoint
}