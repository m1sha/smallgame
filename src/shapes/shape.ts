import { Circle } from './circle'
import { Line } from './line'
import { PolyRectangle } from './polyrect'
import { Rectangle } from './rectangle'
import { RoundedRectangle } from './roundedrect'
import { SegmentLine } from './segment-line'
  
export type Shape = (
  | Rectangle 
  | PolyRectangle
  | RoundedRectangle
  | Circle
  | Line
  | SegmentLine
) 