import { ShapeStyle } from 'shape-style'
import { Circle } from './circle'
import { Rectangle } from './rectangle'
  
export type Shape = (
  | Rectangle 
  | Circle
) & {  style: ShapeStyle } 