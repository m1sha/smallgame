import { CssViewport, TransformViewport, type Viewport, type ViewportType } from './viewport'
import { Surface, type SurfaceCreateOptions } from './surface'
import { type TPoint } from './point'
import { Rect } from './rect'
import { type ISurface } from './interfaces'

export class Screen extends Surface {
  readonly viewport: Viewport

  constructor(viewportType: ViewportType, width: number, height: number, options?: SurfaceCreateOptions) { 
    super(width, height, options)
    
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
    return this.canvas as HTMLCanvasElement
  }

  
  blit (surface: ISurface, rect: Rect | TPoint, distRect: Rect | null = null) {
    if (this.viewport.type === 'css') {
      this.blitx(surface, rect, distRect)  
      return
    }
    
    this.blitx(surface, rect, distRect, this.viewport.zoom, this.viewport.position)
  }
}