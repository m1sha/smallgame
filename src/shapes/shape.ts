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
import { Text } from './text'
import { Arc } from './arc'
import { ArcTo } from './arc-to'
import { Pie } from './pie'

  
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
  | Arc
  | ArcTo
  | Pie
  | CubicBezier
  | Text
) 