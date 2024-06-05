import { Rect } from "./rect"

export class Surface {
  private _canvas: HTMLCanvasElement | OffscreenCanvas
  private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  private _rect: Rect
  
  constructor(width: number, height: number, useAlpha: boolean = true, virtual: boolean = false) {
    this._canvas = virtual ? new OffscreenCanvas(width, height) : document.createElement('canvas')
    this._canvas.width = width
    this._canvas.height = height
    this._rect = new Rect(0, 0, width, height)
    this.ctx = this._canvas.getContext('2d', { alpha: useAlpha })! as CanvasRenderingContext2D
  }

  get draw () { return this.ctx }

  get rect () { return this._rect }

  clear (color: string = "") {
    this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  blit(surface: Surface, rect: Rect) {
    this.ctx.drawImage(surface._canvas, rect.x, rect.y, surface._canvas.width, surface._canvas.height)
  }

  blit_i(surface: Surface, rect: Rect) {
    this.ctx.drawImage(surface.rasterizate()!, rect.x, rect.y, surface._canvas.width, surface._canvas.height)
  }

  rasterizate () {
    if (this._canvas instanceof OffscreenCanvas) return null
    const img = document.createElement("img")
    img.src = this._canvas.toDataURL('image/webp', 1)
    return img
  }

  static fromImage(image: HTMLImageElement, rect: Rect, useAlpha: boolean = true) {
    const surface = new Surface(rect.width, rect.height, useAlpha)
    surface.ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height)
    return surface
  }
}