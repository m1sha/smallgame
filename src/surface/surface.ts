import { mulPoints, Point, setPoint, sumPoints, type TPoint } from "../point"
import { PixelMask } from "../pixel-mask"
import { Rect, TRect } from "../rect"
import { Draw } from "../draw"
import { type CoordinateSystem } from "../coords"

import { Pixels } from "../utils/pixels"
import { CombinedSurface } from "./types"
import { TColorSource } from "../styles/color-source"
import { int2Str } from "../color/imports/int-to-string"
import { SurfaceBase } from "./surface-base"
import { TBlitOptions } from "./blit-options"
import { TSize } from "../size"

export type SurfaceCreateOptions = {
  useAlpha?: boolean
  useSmooth?: boolean
  useOffscreen?: boolean
  coordinateSystem?: CoordinateSystem
  willReadFrequently?: boolean
}

export class Surface extends SurfaceBase {
  protected canvas: HTMLCanvasElement | OffscreenCanvas
  protected ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  readonly draw: Draw
  
  constructor(width: number, height: number, options?: SurfaceCreateOptions, canvas?: HTMLCanvasElement | ImageBitmap) {
    super(width, height, options && options.coordinateSystem ? options.coordinateSystem : 'screen')
    
    this.alpha = options && typeof options.useAlpha === 'boolean' ? options.useAlpha : true
    this.willReadFrequently = options && typeof options.willReadFrequently === 'boolean' ? options.willReadFrequently : true

    if (canvas instanceof ImageBitmap) {
      this.canvas = options && options.useOffscreen ? new OffscreenCanvas(width, height) : document.createElement('canvas')
      const temp = new OffscreenCanvas(canvas.width, canvas.height)
      temp.getContext('bitmaprenderer')?.transferFromImageBitmap(canvas)
      this.ctx = this.canvas.getContext('2d', { alpha: this.alpha, willReadFrequently: this.willReadFrequently })! as CanvasRenderingContext2D
      this.ctx.drawImage(temp, 0, 0)

    } else {
      this.canvas = canvas ? canvas : options && options.useOffscreen ? new OffscreenCanvas(width, height) : document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d', { alpha: this.alpha, willReadFrequently: this.willReadFrequently })! as CanvasRenderingContext2D
    }
    
    this.canvas.width = width
    this.canvas.height = height
    const useSmooth = options && typeof options.useSmooth === 'boolean' ? options.useSmooth : true
    
    this.imageRendering = useSmooth ? 'auto' : 'pixelated'
    this.draw = new Draw(this.ctx, this.coordinateSystem)
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

  get origin () { return this.canvas }

  clear (rect?: TRect) {
    if (rect) {
      this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height)  
      return
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  fill (color: TColorSource) {
    this.ctx.fillStyle = typeof color === 'number' ? int2Str(color) : color
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  rot (a: number) {
    const m = new DOMMatrix()
      .translate(this.width / 2, this.height / 2)
      .rotate(a)
      .translate(-this.width / 2, -this.height / 2)
    this.draw.setTransform(m)
  }

  unrot () {
    this.draw.resetTransform()
  }

  blit (surface: SurfaceBase, rect: Rect | TPoint, options?: TBlitOptions) {
    const opt: TBlitOptions = options ?? {}
    const m = new DOMMatrix()
    
    if (typeof opt.angle === 'number') {
      if (!opt.pivote) {
        m.rotateSelf(opt.angle)
      }
      else if (typeof opt.pivote === 'string') {
        const w = opt.pivoteOwner === 'self' ? ((rect as Rect).width ?? surface.width) / 2 + rect.x : this.width / 2
        const h = opt.pivoteOwner === 'self' ? ((rect as Rect).height ?? surface.height) / 2 + rect.y : this.height / 2
        
        m.translateSelf(w, h)
        .rotateSelf(opt.angle)
        .translateSelf(-w, -h)

      } else if (typeof opt.pivote.x === 'number' && typeof opt.pivote.y === 'number') {
        m.translateSelf(opt.pivote.x, opt.pivote.y)
        .rotateSelf(opt.angle)
        .translateSelf(-opt.pivote.x, -opt.pivote.y)
      }
    }

    if (typeof opt.transform === 'object')  {
      m.multiplySelf(opt.transform)
    }

    this.draw.setTransform(m)
    this.blitx(surface, rect, opt.distRect)
    this.draw.resetTransform()
  }

  blita (alpha: number, surface: SurfaceBase, rect: Rect | TPoint, options?: TBlitOptions) {
    const a = this.ctx.globalAlpha
    if (alpha < 1) this.ctx.globalAlpha = alpha
    this.blit(surface, rect, options)
    if (alpha < 1) this.ctx.globalAlpha = a
  }

  protected blitx(surface: SurfaceBase, rect: Rect | TPoint, distRect: TRect | undefined | null = undefined, zoom: number = 1, shift?: TPoint) {
    const { x, y, width, height } = Object.assign(rect, { 
      width: (rect as Rect).width ?? surface.width, 
      height: (rect as Rect).height ?? surface.height 
    })

    let p0 = this.conv(setPoint(x, y))
    let p1 = this.conv(setPoint(x + width, y + height))

    if (shift) {
      p0 = sumPoints(mulPoints(p0, setPoint(zoom, zoom)), shift)
      p1 = sumPoints(mulPoints(p1, setPoint(zoom, zoom)), shift)
    }

    const outrect = Rect.fromTwoPoints(p0, p1)

    if (distRect) {
      let p2 = this.conv(distRect)
      let p3 = this.conv(setPoint(distRect.x + distRect.width, distRect.y + distRect.height))
      if (shift) {
        p2 = sumPoints(mulPoints(p2, setPoint(zoom, zoom)), shift)
        p3 = sumPoints(mulPoints(p3, setPoint(zoom, zoom)), shift)
      }

      const outDistrect = Rect.fromTwoPoints(p2, p3)
      this.ctx.drawImage(surface.origin, outrect.x, outrect.y, outrect.width, outrect.height, outDistrect.x, outDistrect.y, outDistrect.width, outDistrect.height)
      return  
    }
    
    this.ctx.drawImage(surface.origin, outrect.x, outrect.y, outrect.width, outrect.height)
  }

  clip (rect: TRect): Surface {
    const result = new Surface(rect.width, rect.height)
    result.draw.drawImage(this.ctx.canvas, rect.x, rect.y, rect.width, rect.height, this.rect.x, this.rect.y, rect.width, rect.height)
    return result
  }

  zoomSelf (index: number) {
    if (index === 0) throw Error('Zero is not a support value.')
    if (index < 0) index = 1 / Math.abs(index)
    
    this.resizeSelf(this.width * index, this.height * index)
  }

  zoom (index: number): Surface {
    if (index === 0) throw Error('Zero is not a support value.')
    if (index < 0) index = 1 / Math.abs(index)
    
    return this.resize(this.width * index, this.height * index)
  }

  scaleSelf (dx: number, dy: number) {
    this.resizeSelf(this.width * dx, this.height * dy)
  }

  scale (dx: number, dy: number) {
    return this.resize(this.width * dx, this.height * dy)
  }

  flipSelf (position: 'x' | 'y' | 'xy') {
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

  flip (position: 'x' | 'y' | 'xy') {
    const surface = new Surface(this.width, this.height, { 
      coordinateSystem: this.coordinateSystem, 
      useSmooth: this.imageRendering === 'auto',
      useOffscreen: this instanceof OffscreenCanvas,
      useAlpha: this.alpha,
      willReadFrequently: this.willReadFrequently
    })

    const w = position === 'y' ? 0 : this.width
    const h = position === 'x' ? 0 : this.height
    const x = position === 'y' ? 1 : -1
    const y = position === 'x' ? 1 : -1

    surface.ctx.translate(w, h)
    surface.ctx.scale(x, y)
    surface.ctx.drawImage(this.origin, 0, 0)
    surface.ctx.resetTransform()

    return surface
  }

  rotateSelf (a: number, pivot?: TPoint) {
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

  resize (width: number, height: number): Surface {
    const surface = new Surface(width, height, { 
      coordinateSystem: this.coordinateSystem, 
      useSmooth: this.imageRendering === 'auto',
      useOffscreen: this instanceof OffscreenCanvas,
      useAlpha: this.alpha,
      willReadFrequently: this.willReadFrequently
    })

    surface.blit(this, surface.rect)
    return surface
  }

  resizeSelf (width: number, height: number): void {
    const canvas = this.cloneCanvas()
    this.canvas.width = width
    this.canvas.height = height
    if (this.imageRendering === 'pixelated') this.ctx.imageSmoothingEnabled = false
    this.ctx.drawImage(canvas, 0, 0, width, height)
    this._rect.resizeSelf(width, height)
  }

  setCanvasSize  (width: number, height: number, shiftToCenter: boolean = true) {
    const canvas = this.cloneCanvas()
    this.clear()
    const shiftX = shiftToCenter ? (width - canvas.width) / 2 : 0
    const shiftY = shiftToCenter ? (height - canvas.height) / 2: 0
    this.canvas.width = width
    this.canvas.height = height
    
    this.ctx.drawImage(canvas, shiftX, shiftY, canvas.width, canvas.height)
    this._rect.resizeSelf(width, height)
  }

  get pixels (): Pixels {
    return new Pixels(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
  }

  set pixels (value: Pixels) {
    this.ctx.putImageData(value.imageData, 0, 0)
  }

  mix (method: GlobalCompositeOperation, surface: SurfaceBase, rect: Rect | TPoint, options?: TBlitOptions) {
    const old = this.ctx.globalCompositeOperation
    this.ctx.globalCompositeOperation = method
    this.blit(surface, rect, options)
    this.ctx.globalCompositeOperation = old
  }
  
  toPattern (repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat"): CanvasPattern {
    if (this.canvas instanceof OffscreenCanvas) throw new Error('Cannot create an pattern from the OffscreenCanvas.')
    return this.draw.createPattern(this.canvas, repetition)
  }

  createMask (): PixelMask {
    const imageDate = this.ctx.getImageData(0, 0, this.width, this.height)
    return PixelMask.fromImageData(imageDate)
  }

  clone (): Surface {
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

  static combine (images: SurfaceBase[], rows: number, cols: number): CombinedSurface {
    const rects: Rect[] = []
    let k = 0
    const pos = Point.zero
    let maxH = 0
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (k >= images.length) break
        
        const img = images[k++]

        rects.push(new Rect(pos.x, pos.y, img.width, img.height))

        pos.shiftXSelf(img.width)
        if (img.height > maxH) maxH = img.height
      }
      
      pos.shiftYSelf(maxH) 
      pos.moveXSelf(0)
      maxH = 0
    }

    const { width, height } = Rect.merge(rects)
    const surface = new Surface(width, height)
    k = 0
    pos.moveSelf(0, 0)
    maxH = 0
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (k >= images.length) break
        
        const rect = rects[k]
        const img = images[k++]
        
        surface.blit(img, rect)

        pos.shiftXSelf(img.width)
        if (img.height > maxH) maxH = img.height
      }
      
      pos.shiftYSelf(maxH) 
      pos.moveXSelf(0)
      maxH = 0
    }


    return { surface, rects }
  }

  static mix (method: GlobalCompositeOperation, bgSurface: SurfaceBase, fgSurface: SurfaceBase, fgRect: Rect | TPoint, options?: TBlitOptions): Surface {
    const surface = new Surface(bgSurface.width, bgSurface.width, { 
      useOffscreen: bgSurface instanceof OffscreenCanvas,
      coordinateSystem: (bgSurface as any).coordinateSystem,
      willReadFrequently: (bgSurface as any).willReadFrequently,
    })

    surface.blit(bgSurface, bgSurface.rect)
    const old = surface.ctx.globalCompositeOperation
    surface.ctx.globalCompositeOperation = method
    surface.blit(fgSurface, fgRect, options)
    surface.ctx.globalCompositeOperation = old
    return surface
  }

  private cloneCanvas (size?: { width: number, height: number }) {
    const shift = Point.zero
    if (size) {
      shift.move(Math.abs((size.width - this.width / 2)), Math.abs((size.height - this.height / 2)))
    }

    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    canvas.getContext('2d')!.drawImage(this.ctx.canvas, shift.x, shift.y)
    return canvas
  }
}

export class MemSurface extends Surface {
  constructor (size: TSize, options?: SurfaceCreateOptions) {
    super(size.width, size.height, {
      useOffscreen: true,
      coordinateSystem: options?.coordinateSystem,
      useAlpha: options?.useAlpha,
      useSmooth: options?.useSmooth,
      willReadFrequently:options?.willReadFrequently
    })
  }
}
