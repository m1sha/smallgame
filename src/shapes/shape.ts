import { type Circle } from './circle'
import { type HLine } from './hline'
import { type Line } from './line'
import { type Pixel } from './pixel'
import { type Polydots } from './polydots'
import { type Polygon } from './polygon'
import { type PolyRectangle } from './polyrect'
import { type Rectangle } from './rectangle'
import { type RoundedRectangle } from './roundedrect'
import { type SegmentLine } from './segment-line'
import { Arrows } from './arrows'
import { Arrow } from './arrow'
import { type VLine } from './vline'
import { CubicBezier } from './cubic-bezier'

  
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
  | Arrow
  | CubicBezier
) 