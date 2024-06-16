import { PixelMask } from "./pixel-mask"
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

  blit(surface: Surface, rect: Rect, distRect: Rect | null = null) {
    if (distRect) {
      this.#ctx.drawImage(surface.#canvas, rect.x, rect.y, surface.width, surface.height, distRect.x, distRect.y, distRect.width, distRect.height)
      return  
    }
    this.#ctx.drawImage(surface.#canvas, rect.x, rect.y, surface.width, surface.height)
  }

  zoom (index: number) {
    const image = this.toImage()
    this.#ctx.clearRect(0, 0, this.width, this.height)
    this.#ctx.drawImage(image, 0, 0, this.width, this.height, 0, 0, this.width * index, this.height * index)
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

  rotate (a: number) {
    this.#ctx.clearRect(0, 0, this.width, this.height)
    this.#ctx.translate(this.width / 2, this.height /2)
    this.#ctx.rotate(a * Math.PI / 180)
    this.#ctx.translate(-this.width /2, -this.height /2)
    this.#ctx.drawImage(this.#canvas, 0, 0, this.width, this.height)
  }

  toImage () {
    if (this.#canvas instanceof OffscreenCanvas) throw new Error('Cannot create an image from the OffscreenCanvas.')
    const img = document.createElement("img")
    img.src = this.#canvas.toDataURL('image/webp', 1)
    return img
  }

  createMask () {
    const imageDate = this.#ctx.getImageData(0, 0, this.width, this.height)
    return PixelMask.fromImageData(imageDate)
  }

  static fromImage(image: HTMLImageElement, rect: Rect, useAlpha: boolean = true) {
    const surface = new Surface(rect.width, rect.height, useAlpha)
    surface.#ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height)
    return surface
  }

  static fromImages(images: HTMLImageElement[], rect: Rect, rows: number = 1, cols: number = -1, useAlpha: boolean = true,) {
    const surface = new Surface(rect.width * images.length, rect.height, useAlpha)

    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      surface.#ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height, rect.x + rect.width * i, rect.y, rect.width, rect.height)
    }
    
    return surface
  }
}