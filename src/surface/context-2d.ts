import { TSize } from "../size"

export class Context2d {
  canvas: HTMLCanvasElement | OffscreenCanvas
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  
  constructor (
      { width, height }: TSize, 
      public readonly offscreen: boolean, 
      public readonly alpha: boolean, 
      canvas?: HTMLCanvasElement | OffscreenCanvas
    ) {
    this.canvas = canvas ? canvas : offscreen ? new OffscreenCanvas(width, height) : document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext('2d', { alpha, willReadFrequently: true })! as CanvasRenderingContext2D
  }
}