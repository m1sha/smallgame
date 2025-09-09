import { type TPoint } from '../point'
import { Rect, type TRect } from '../rect'
import { coordconv, type CoordinateSystem } from '../coords'
import { type TColorSource } from 'styles/color-source'

export abstract class SurfaceBase {
  protected conv: (point: TPoint) => TPoint
  protected coordinateSystem: CoordinateSystem
  protected _rect: Rect
  protected abstract canvas: HTMLCanvasElement | OffscreenCanvas

  constructor (width: number, height: number, coordinateSystem: CoordinateSystem) {
    this.coordinateSystem = coordinateSystem
    this.conv = point => coordconv(coordinateSystem, point, width, height) 
    this._rect = new Rect(0, 0, width, height)
  }

  get rect () { return this._rect }
  get width () { return this._rect.width }
  get height () { return this._rect.height }

  abstract imageRendering: 'auto' | 'pixelated'
  abstract clear (rect?: TRect): void
  abstract fill (color: TColorSource): void
  abstract flip (position: 'x' | 'y' | 'xy'): void
  abstract resize (width: number, height: number): void
  abstract scale (dx: number, dy: number): void
  abstract rotate (a: number, pivot?: TPoint): void
  abstract setCanvasSize  (width: number, height: number, shiftToCenter: boolean): void
  abstract clone (): SurfaceBase

  get origin () { return this.canvas }

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

  toBitmap (): ImageBitmap {
    if (this.canvas instanceof OffscreenCanvas) return this.canvas.transferToImageBitmap()
    throw new Error('Method is unsupported')
  }

  save (type?: string, quality?: any): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (this.canvas instanceof OffscreenCanvas) throw new Error('Cannot create an image from the OffscreenCanvas.')
      this.canvas.toBlob(blob => resolve(blob), type, quality)
    })
  }
}