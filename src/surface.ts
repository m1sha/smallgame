import { mulPoints, Point, setPoint, sumPoints, type TPoint } from "./point"
import { PixelMask } from "./pixel-mask"
import { Rect } from "./rect"
//import { Game } from "./game"
import { Draw } from "./draw"
import { coordconv, type CoordinateSystem } from "./coords"
import { type ISurface } from "./interfaces"
import { Pixels } from "./utils/pixels"

export type SurfaceCreateOptions = {
  useAlpha?: boolean
  useSmooth?: boolean
  useOffscreen?: boolean
  coordinateSystem?: CoordinateSystem
}

export class Surface {
  protected canvas: HTMLCanvasElement | OffscreenCanvas
  protected ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  #rect: Rect
  #conv: (point: TPoint) => TPoint
  readonly draw: Draw
  
  constructor(width: number, height: number, options?: SurfaceCreateOptions, canvas?: HTMLCanvasElement) {
    this.canvas = canvas ? canvas : options && options.useOffscreen ? new OffscreenCanvas(width, height) : document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    const coordinateSystem = options && options.coordinateSystem ? options.coordinateSystem : 'screen'
    const alpha = options && typeof options.useAlpha === 'boolean' ? options.useAlpha : true
    const useSmooth = options && typeof options.useSmooth === 'boolean' ? options.useSmooth : true
    this.#conv = point => coordconv(coordinateSystem, point, width, height) 
    this.#rect = new Rect(0, 0, width, height)
    this.ctx = this.canvas.getContext('2d', { alpha, willReadFrequently: true })! as CanvasRenderingContext2D
    this.imageRendering = useSmooth ? 'auto' : 'pixelated'
    this.draw = new Draw(this.ctx, coordinateSystem)
  }

  get imageRendering () { 
    if (this.canvas instanceof OffscreenCanvas) return 'auto'
    const value = (this.canvas as HTMLCanvasElement).style.imageRendering || 'auto' 
    return value === 'auto' ? 'auto' : 'pixelated'
  }

  set imageRendering (value: 'auto' | 'pixelated') { 
    if (this.canvas instanceof OffscreenCanvas) return
    ;(this.canvas as HTMLCanvasElement).style.imageRendering = value 
    this.ctx.imageSmoothingEnabled = value === 'auto'
  }

  get rect () { return this.#rect }

  get width () { return this.#rect.width }

  get height () { return this.#rect.height }


  clear () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  fill (color: string) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  blit(surface: ISurface, rect: Rect | TPoint, distRect: Rect | null = null) {
    this.blitx(surface, rect, distRect)
  }

  blita(alpha: number, surface: ISurface, rect: Rect | TPoint, distRect: Rect | null = null) {
    const a = this.ctx.globalAlpha
    if (alpha < 1) this.ctx.globalAlpha = alpha
    this.blitx(surface, rect, distRect)
    if (alpha < 1) this.ctx.globalAlpha = a
  }

  protected blitx(surface: ISurface, rect: Rect | TPoint, distRect: Rect | null = null, zoom: number = 1, shift?: TPoint) {
    const { x, y, width, height } = Object.assign(rect, { 
      width: (rect as Rect).width ?? surface.width, 
      height: (rect as Rect).height ?? surface.height 
    })

    let p0 = this.#conv(setPoint(x, y))
    let p1 = this.#conv(setPoint(x + width, y + height))

    if (shift) {
      p0 = sumPoints(mulPoints(p0, setPoint(zoom, zoom)), shift)
      p1 = sumPoints(mulPoints(p1, setPoint(zoom, zoom)), shift)
    }

    const outrect = Rect.fromTwoPoints(p0, p1)

    if (distRect) {
      let p2 = this.#conv(distRect)
      let p3 = this.#conv(setPoint(distRect.x + distRect.width, distRect.y + distRect.height))
      if (shift) {
        p2 = sumPoints(mulPoints(p2, setPoint(zoom, zoom)), shift)
        p3 = sumPoints(mulPoints(p3, setPoint(zoom, zoom)), shift)
      }

      const outDistrect = Rect.fromTwoPoints(p2, p3)
      const ctx = (surface as any).ctx
      if (!ctx) throw new Error('Context is not found.')
      this.ctx.drawImage(ctx.canvas, outrect.x, outrect.y, outrect.width, outrect.height, outDistrect.x, outDistrect.y, outDistrect.width, outDistrect.height)
      return  
    }

    const ctx = (surface as any).ctx
    if (!ctx) throw new Error('Context is not found.')
    this.ctx.drawImage(ctx.canvas, outrect.x, outrect.y, outrect.width, outrect.height)
  }

  zoom (index: number) {
    if (index === 0) throw Error('Zero is not a support value.')
    if (index < 0) index = 1 / Math.abs(index)
    
    this.resize(this.width * index, this.height * index)
  }

  flip (position: 'x' | 'y' | 'xy') {
    const w = position === 'y' ? 0 : this.width
    const h = position === 'x' ? 0 : this.height
    const x = position === 'y' ? 1 : -1
    const y = position === 'x' ? 1 : -1
    const canvas = this.cloneCanvas()
    this.clear()
    
    this.ctx.translate(w, h)
    this.ctx.scale(x, y)
    this.ctx.drawImage(canvas, 0, 0)
    this.ctx.resetTransform()
  }

  rotate (a: number, pivot?: TPoint) {
    const canvas = this.cloneCanvas()
    this.clear()
    let x = this.width / 2
    let y = this.height / 2
    if (pivot) {
      ({ x, y } = pivot)
    }
    
    this.ctx.translate(x, y)
    this.ctx.rotate(a * Math.PI / 180)
    this.ctx.translate(-x, -y)
    this.ctx.drawImage(canvas, 0, 0)
    this.ctx.resetTransform()
  }

  resize (width: number, height: number) {
    const canvas = this.cloneCanvas()
    this.canvas.width = width
    this.canvas.height = height
    if (this.imageRendering === 'pixelated') this.ctx.imageSmoothingEnabled = false
    this.ctx.drawImage(canvas, 0, 0, width, height)
    this.#rect.resizeSelf(width, height)
  }

  setCanvasSize  (width: number, height: number, shiftToCenter: boolean = true) {
    const canvas = this.cloneCanvas()
    this.clear()
    const shiftX = shiftToCenter ? (width - canvas.width) / 2 : 0
    const shiftY = shiftToCenter ? (height - canvas.height) / 2: 0
    this.canvas.width = width
    this.canvas.height = height
    
    this.ctx.drawImage(canvas, shiftX, shiftY, canvas.width, canvas.height)
    this.#rect.resizeSelf(width, height)
  }

  get pixels (): Pixels {
    return new Pixels(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
  }

  set pixels (value: Pixels) {
    this.ctx.putImageData(value.imageData, 0, 0)
  }

  mix (method: GlobalCompositeOperation, surface: ISurface, rect: Rect | TPoint, distRect: Rect | null = null) {
    const old = this.ctx.globalCompositeOperation
    this.ctx.globalCompositeOperation = method
    this.blit(surface, rect, distRect)
    this.ctx.globalCompositeOperation = old
  }

  createImage (type?: string, quality?: any): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = document.createElement("img")
      img.onload = () => resolve(img)
      img.src = this.toDataURL(type, quality)
    })
  }

  toDataURL (type?: string, quality?: any): string {
    if (this.canvas instanceof OffscreenCanvas) throw new Error('Cannot create an image from the OffscreenCanvas.')
    return this.canvas.toDataURL(type, quality)
  }

  toPattern (repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat"): CanvasPattern {
    if (this.canvas instanceof OffscreenCanvas) throw new Error('Cannot create an pattern from the OffscreenCanvas.')
    return this.draw.createPattern(this.canvas, repetition)
  }

  toBitmap () {
    if (this.canvas instanceof OffscreenCanvas) return this.canvas.transferToImageBitmap()
    throw new Error('Method is unsupported')
  }

  save (type?: string, quality?: any): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (this.canvas instanceof OffscreenCanvas) throw new Error('Cannot create an image from the OffscreenCanvas.')
      this.canvas.toBlob(blob => resolve(blob), type, quality)
    })
  }

  createMask () {
    const imageDate = this.ctx.getImageData(0, 0, this.width, this.height)
    return PixelMask.fromImageData(imageDate)
  }

  clone () {
    const surface = new Surface(this.width, this.height)
    const canvas = this.cloneCanvas()
    surface.canvas = canvas
    surface.imageRendering = this.imageRendering
    surface.ctx = canvas.getContext('2d')!
    return surface
  }

  static fromImage(image: HTMLImageElement | ImageBitmap, rect: Rect, options?: { useAlpha?: boolean, useSmooth?: boolean }) {
    const useAlpha = options && typeof options.useAlpha === 'boolean' ? options.useAlpha: true
    const useSmooth = options && typeof options.useSmooth === 'boolean' ? options.useSmooth: true
    const surface = new Surface(rect.width, rect.height, { useAlpha })
    surface.imageRendering = useSmooth ? 'auto' : 'pixelated'
    surface.ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height)
    return surface
  }

  static fromCanvas (canvas: HTMLCanvasElement, options?: SurfaceCreateOptions) {
    return new Surface(canvas.width, canvas.height, options, canvas)
  }

  // @ts-ignore
  static fromImages(images: HTMLImageElement[], rect: Rect, rows: number = 1, cols: number = -1, useAlpha: boolean = true, useSmooth: boolean = true) {
    const surface = new Surface(rect.width * images.length, rect.height, { useAlpha })
    surface.imageRendering = useSmooth ? 'auto' : 'pixelated'

    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      surface.ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height, rect.x + rect.width * i, rect.y, rect.width, rect.height)
    }
    
    return surface
  }

  static get default () {
    return new Surface(1, 1)
  }

  private cloneCanvas (size?: { width: number, height: number }) {
    // const { width, height } = Object.assign({}, { 
    //   width: size ? size.width : this.width,
    //   height : size ? size.height : this.height,
    // })

    const shift = Point.zero
    if (size) {
      shift.move(Math.abs((size.width - this.width / 2)), Math.abs((size.height - this.height / 2)))
    }

    // const imageDate = this.#ctx.getImageData(0, 0, width, height)
    // const canvas = document.createElement('canvas')
    // canvas.width = this.width
    // canvas.height = this.height
    // canvas.getContext('2d')!.putImageData(imageDate, shift.x, shift.y)
    // return canvas
    
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    canvas.getContext('2d')!.drawImage(this.ctx.canvas, shift.x, shift.y)
    return canvas
  }
}