import { type TPoint } from "../point"
import { setRect, type TRect, resetRect, Rect } from "../rect"
import { ViewportBase } from "./viewport-base"

export class CssViewport extends ViewportBase {
  #htmlContainer: HTMLDivElement
  #rect: TRect
  #zoom: number = 1
  readonly type = 'css'

  constructor (canvas: HTMLCanvasElement, scrollbarSize: number = 18) {
    super(canvas)
    
    this.#htmlContainer = document.createElement('div')
    this.#htmlContainer.append(canvas)
    this.#htmlContainer.style.overflow = 'auto'
    this.#htmlContainer.style.setProperty('--scrollbar-size', scrollbarSize + 'px')
    this.#htmlContainer.style.maxHeight = `calc(${canvas.height}px + var(--scrollbar-size))`
    this.#htmlContainer.style.maxWidth = `calc(${canvas.width}px + var(--scrollbar-size))`

    const { scrollLeft, scrollTop, clientWidth, clientHeight } = this.#htmlContainer
    this.#rect = setRect(scrollLeft, scrollTop, clientWidth, clientHeight)

    this.#htmlContainer.addEventListener('scroll', () => {
      const { scrollLeft, scrollTop, clientWidth, clientHeight } = this.#htmlContainer
      resetRect(this.#rect, scrollLeft, scrollTop, clientWidth, clientHeight)
    })
  }

  get rect (): Readonly<TRect> {
    return this.#rect
  }

  get htmlContainer () {
    return this.#htmlContainer
  }

  get zoom () {
    return this.#zoom
  }

  set zoom (index: number) {
    if (!index) throw new Error('unsupport index value.')
    
    this.#zoom = index
    this.canvas.style.width = (this.canvas.width * index) + 'px'
    this.canvas.style.height = (this.canvas.height * index) + 'px'
  }

  get position (): TPoint {
    return this.#rect
  }

  set position (value: TPoint) {
    this.#rect.x = value.x
    this.#rect.y = value.y
  }

  get center (): TPoint {
    return this.#rect
  }

  set center (value: TPoint) {
    const rect = Rect.from(this.#rect)
    rect.center = value
    this.#rect = rect
  }
}