import { Surface } from './surface'

export class Screen extends Surface {
  get delta () {
    const canvas = this.innteralCanvas
    const rect = canvas.getBoundingClientRect()
    return { x: rect.width / canvas.width, y: rect.height / canvas.height }
  }

  get cursor () {
    return this.innteralCanvas.style.cursor
  }

  set cursor (value: string) {
    this.innteralCanvas.style.cursor = value
  }

  private get innteralCanvas() {
    return this.canvas as HTMLCanvasElement
  }
}