import { TSize } from "size"
import { GlProgram } from "./gl-program"
import { FragmnetShader, VertexShader } from "./gl-shader"
import { getShape, GlShape } from "./types"

export class GL {
  #prog: GlProgram | undefined = undefined
  readonly canvas: HTMLCanvasElement | OffscreenCanvas
  readonly ctx: WebGL2RenderingContext 

  constructor (viewportSize: TSize, offscreen: boolean = false, canvas?: HTMLCanvasElement) {
    this.canvas = canvas ? canvas : offscreen ? new OffscreenCanvas(viewportSize.width, viewportSize.height) : document.createElement('canvas')
    this.canvas.width = viewportSize.width
    this.canvas.height = viewportSize.height
    this.ctx = this.canvas.getContext('webgl2')!
  }

  get available () {
    return Boolean(this.ctx)
  }
  
  private get prog () {
    if (!this.#prog) throw new Error('A GL Program is not specified.')
    return this.#prog!
  }

  clear () {
    const gl = this.ctx
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    //gl.colorMask(true, true, true, false)
  }

  drawArrays (type: GlShape = 'points', vertexCount: number = 1, offset: number = 0) {
    const gl = this.ctx
    const shape = getShape(gl, type)
    gl.drawArrays(shape, offset, vertexCount)
  }

  use (prog: GlProgram) {
    this.#prog = prog
    this.ctx.useProgram(prog.origin)
  }

  viewport (size: TSize) {
    this.ctx.viewport(0, 0, size.width, size.width)
  }

  createProgram (vss: string, fss: string, options: 'default' | 'assemble' | 'assemble-and-use' = 'default') {
    const prog = new GlProgram(this.ctx, new VertexShader(this.ctx, vss), new FragmnetShader(this.ctx, fss))
    if (options.startsWith('assemble')) prog.create()
    if (options === 'assemble-and-use') this.use(prog)
    return prog
  }
}