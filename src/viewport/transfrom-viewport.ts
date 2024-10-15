import { TPoint } from "../point"
import { Rect, TRect } from "../rect"
import { ViewportBase } from "./viewport-base"

export class TransformViewport extends ViewportBase {
  readonly type = 'transform'
  #rect: Rect
  #zoom: number

  constructor (canvas: HTMLCanvasElement) {
    super(canvas)
    this.#rect = Rect.size(canvas.width,  canvas.height)
    this.#zoom = 1
  }

  get rect (): Readonly<TRect> {
    return this.#rect
  }
  
  get zoom (): number {
    return this.#zoom
  }

  set zoom (value: number) {
    this.#zoom = value
  }

  get position (): TPoint {
    return this.#rect
  }

  set position (value: TPoint) {
    this.#rect.x = value.x
    this.#rect.y = value.y
  }

  get center (): TPoint {
    return this.#rect.center
  }

  set center (value: TPoint) {
    this.#rect.moveSelf(value, 'center-center')
  }
}