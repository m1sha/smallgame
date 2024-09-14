import { Viewport } from './viewport'
import { Surface } from './surface'

export class Screen extends Surface {
  readonly viewport: Viewport

  constructor(width: number, height: number, useAlpha: boolean = true, virtual: boolean = false) { 
    super(width, height, useAlpha, virtual)
    this.viewport = new Viewport(this.originCanvas)
  }

  get delta () {
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