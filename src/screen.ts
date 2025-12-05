import { CssViewport, TransformViewport, type Viewport, type ViewportType } from './viewport'
import { Surface, type SurfaceCreateOptions } from './surface'
import { type TPoint } from './point'
import { Rect, TRect } from './rect'
import { SurfaceGL } from './surface-gl'
import { TColorSource } from './styles/color-source'
import { SurfaceBase } from './surface/surface-base'
import { TSize } from './size'

export class Screen {
  readonly viewport: Viewport
  //readonly surface: SurfaceGL 
  readonly surface: Surface

  constructor(viewportType: ViewportType, width: number, height: number, options?: SurfaceCreateOptions) { 
    // this.surface = new SurfaceGL(width, height, options) //super(width, height, options)
    // this.surface.create()

    this.surface = new Surface(width, height, options)
    
    this.viewport = viewportType === 'css' 
      ? new CssViewport(this.originCanvas) 
      : new TransformViewport(this.originCanvas)
  }

  get ratio (): TPoint {
    const canvas = this.originCanvas
    const rect = canvas.getBoundingClientRect()
    return { x: rect.width / canvas.width, y: rect.height / canvas.height }
  }

  get cursor () {
    return this.originCanvas.style.cursor
  }

  set cursor (value: string) {
    this.originCanvas.style.cursor = value
  }

  get originCanvas () {
    return this.surface.origin as HTMLCanvasElement // this.surface.context.canvas as HTMLCanvasElement
  }

  get size (): TSize {
    return this.surface.rect
  }

  set size (size: TSize) {
    this.surface.setCanvasSize(size.width, size.height)
  }

  get rect () {
    return this.surface.rect
  }

  get imageRendering () {
    return this.surface.imageRendering
  }

  set imageRendering (value: 'auto' | 'pixelated') {
    this.surface.imageRendering = value
  }

  fill (color: TColorSource) {
    this.surface.fill(color)
  }

  clear (rect?: TRect) {
    this.surface.clear(rect)
  }
  
  blit (surface: SurfaceBase, rect: Rect | TPoint) {
    if (this.viewport.type === 'css') {
      this.surface.blit(surface, rect)  
      return
    }
    
    this.surface.blit(surface, rect)
  }

  blita (alpha: number, surface: SurfaceBase, rect: Rect | TPoint, distRect?: Rect) {
    if (this.viewport.type === 'css') {
      this.surface.blita(alpha, surface, rect)  
      return
    }
    
    this.surface.blita(alpha, surface, rect)
  }

  dispose () {
    this.originCanvas.remove()
  }

  disableContextMenu () {
    this.originCanvas.addEventListener('contextmenu', e => e.preventDefault())
  }
}