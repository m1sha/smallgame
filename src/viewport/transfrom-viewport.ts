import { setRect, TRect } from "../rect"
import { ViewportBase } from "./viewport-base"

export class TransformViewport extends ViewportBase {
  readonly type = 'transform'
  #rect: TRect

  constructor (canvas: HTMLCanvasElement) {
    super(canvas)
    this.#rect = setRect(0, 0, canvas.width,  canvas.height)
  }

  get rect (): Readonly<TRect> {
    return this.#rect
  }
  
  get zoom(): number {
    throw new Error("Method not implemented.");
  }

  set zoom(value: number) {
    throw new Error("Method not implemented.");
  }
}