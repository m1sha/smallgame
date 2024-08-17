import { ShapeStyle } from '../styles/shape-style'
import { Circle } from './circle'
import { Line } from './line'
import { PolyRectangle } from './polyrect'
import { Rectangle } from './rectangle'
import { RoundedRectangle } from './roundedrect'
  
export type Shape = (
  | Rectangle 
  | PolyRectangle
  | RoundedRectangle
  | Circle
  | Line
) & { style: ShapeStyle } 