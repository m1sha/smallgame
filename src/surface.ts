import { Rect } from "./rect"

export class Surface {
  #canvas: HTMLCanvasElement | OffscreenCanvas
  #ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  #rect: Rect
  
  constructor(width: number, height: number, useAlpha: boolean = true, virtual: boolean = false) {
    this.#canvas = virtual ? new OffscreenCanvas(width, height) : document.createElement('canvas')
    this.#canvas.width = width
    this.#canvas.height = height
    this.#rect = new Rect(0, 0, width, height)
    this.#ctx = this.#canvas.getContext('2d', { alpha: useAlpha })! as CanvasRenderingContext2D
  }

  get draw () { return this.#ctx }

  get rect () { return this.#rect }

  get width () { return this.#rect.width }

  get height () { return this.#rect.height }

  clear () {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
  }

  fill (color: string) {
    this.#ctx.fillStyle = color
    this.#ctx.fillRect(0, 0, this.width, this.height)
  }

  blit(surface: Surface, rect: Rect) {
    this.#ctx.drawImage(surface.#canvas, rect.x, rect.y, surface.width, surface.height)
  }

  zoom (index: number) {
    this.#ctx.drawImage(this.#canvas, 0, 0, this.width, this.height, 0, 0, this.width * index, this.height * index)
  }

  flip (position: 'x' | 'y' | 'xy') {
    const w = position === 'y' ? 0 : this.width
    const h = position === 'x' ? 0 : this.height
    const x = position === 'y' ? 1 : -1
    const y = position === 'x' ? 1 : -1
    
    this.#ctx.translate(w, h)
    this.#ctx.scale(x, y)
    this.#ctx.drawImage(this.#canvas, 0, 0, this.width, this.height)
  }

  /*

  blit_i(surface: Surface, rect: Rect) {
    this.ctx.drawImage(surface.rasterizate()!, rect.x, rect.y, surface.width, surface.height)
  }

  rasterizate () {
    if (this._canvas instanceof OffscreenCanvas) return null
    const img = document.createElement("img")
    img.src = this._canvas.toDataURL('image/webp', 1)
    return img
  }

  */

  static fromImage(image: HTMLImageElement, rect: Rect, useAlpha: boolean = true) {
    const surface = new Surface(rect.width, rect.height, useAlpha)
    surface.#ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height)
    return surface
  }
}