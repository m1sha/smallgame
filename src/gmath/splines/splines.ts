import { cubicBezier } from "./cubic-bezier"
import { quadraticBezier } from "./quadratic-bezier"
import { chaikin, bspline, catmullRom, gaussianSmooth } from "./smooth"

const Splines = {
  cubicBezier,
  quadraticBezier,
  chaikin,
  bspline,
  catmullRom,
  gaussianSmooth
}

export { Splines }