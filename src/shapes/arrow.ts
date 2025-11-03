
import { TPoint } from "../point"
import { ShapeStyle } from "../styles/shape-style"
import { ArrowDrawOptions } from '../sketch/options'

export class Arrow {
  style: ShapeStyle
  type: 'arrow' = 'arrow'
  p0: TPoint
  p1: TPoint
  options: ArrowDrawOptions 

  constructor (opt: { style: ShapeStyle, p0: TPoint, p1: TPoint, options: ArrowDrawOptions }) {
    this.style = opt.style
    this.p0 = opt.p0
    this.p1 = opt.p1
    this.options = opt.options
  }
}