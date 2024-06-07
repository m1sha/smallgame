import { ShapeStyle } from '../styles/shape-style'
import { Circle } from './circle'
import { Line } from './line'
import { Rectangle } from './rectangle'
  
export type Shape = (
  | Rectangle 
  | Circle
  | Line
) & { style: ShapeStyle } 