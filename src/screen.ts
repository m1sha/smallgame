import { Surface } from './surface'

export class Screen extends Surface {
  get delta () {
    const canvas = this.canvas as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    return { x: rect.width / canvas.width, y: rect.height / canvas.height }
  }
}