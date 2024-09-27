import { TRect } from "../rect"

export abstract class ViewportBase {
  protected canvas: HTMLCanvasElement

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  get htmlContainer (): HTMLElement {
    return this.canvas
  }

  abstract get rect (): Readonly<TRect> 
  abstract get zoom (): number
  abstract set zoom (value: number)
}