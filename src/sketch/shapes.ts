import { Shape } from "../shapes"

export class Shapes {
  constructor (private shapes: Shape[]) {

  }

  get all () {
    return this.shapes
  }

  get current () {
    return this.shapes[this.shapes.length = 1]
  }
}