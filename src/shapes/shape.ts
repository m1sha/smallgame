import { Circle } from './circle'
import { HLine } from './hline'
import { Line } from './line'
import { Pixel } from './pixel'
import { Polydots } from './polydots'
import { Polygon } from './polygon'
import { PolyRectangle } from './polyrect'
import { Rectangle } from './rectangle'
import { RoundedRectangle } from './roundedrect'
import { SegmentLine } from './segment-line'
import { Arrows } from './arrows'
import { VLine } from './vline'
  
export type Shape = (
  | Rectangle 
  | PolyRectangle
  | RoundedRectangle
  | Polygon
  | Polydots
  | Circle
  | Line
  | VLine
  | HLine
  | SegmentLine
  | Pixel
  | Arrows
) 