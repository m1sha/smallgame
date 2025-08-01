import { type ISurface } from "../interfaces"
import { Rect } from "../rect"
import { GlProgram } from "./gl-program"
import { FragmnetShader, VertexShader } from "./gl-shader"
import { removeItem } from "../utils/array"
import { GL } from "./gl"

export class GlSurface implements ISurface {
  #rect: Rect
  readonly context: GL
  readonly programs: GlProgram[] = []

  constructor (width: number, height: number) {
    this.context = new GL({ width, height })
    this.#rect = new Rect(0, 0, width, height)
  }

  protected get canvas () { return this.context.canvas}
  protected get ctx () { return this.context.ctx }
  
  get rect () {
    return this.#rect
  }

  get width (): number {
    return this.#rect.width
  }

  get height (): number {
    return this.#rect.height
  }

  createProgram (vertexShaderSource: string, fragmnetShaderSource: string) {
    const vertexShader = new VertexShader(this.context.ctx, vertexShaderSource)
    const fragmnetShader = new FragmnetShader(this.context.ctx, fragmnetShaderSource)
    const program = new GlProgram(this.context.ctx, vertexShader, fragmnetShader)
    this.programs.push(program)
    program.create()
    return program
  }

  createDefaultProgram (vertexShaderSource: string, fragmnetShaderSource: string) {
    const program = this.createProgram(vertexShaderSource, fragmnetShaderSource)
    this.useProgram(program)
    return program
  }

  useProgram (program: GlProgram) {
    this.context.use(program)
  }
  
  deleteProgram (program: GlProgram) {
    removeItem(this.programs, p => p === program)
  }

  get origin () {
    return this.canvas
  }

  toPattern (repetition: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat') {
    const canvas = document.createElement('canvas')
    const pattern = canvas.getContext('2d')?.createPattern(this.canvas, repetition)
    if (!pattern) throw new Error('Can not create a pattern.')
    return pattern
  }
}