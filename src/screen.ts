import { CssViewport, TransformViewport, Viewport, ViewportType } from './viewport'
import { Surface } from './surface'
import { CoordinateSystem } from './coords'
import { TPoint } from './point'

export class Screen extends Surface {
  readonly viewport: Viewport

  constructor(viewportType: ViewportType, width: number, height: number, options?: { useAlpha?: boolean, virtual?: boolean, coordinateSystem?: CoordinateSystem }) { 
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

  get originCanvas() {
    return this.canvas as HTMLCanvasElement
  }
}