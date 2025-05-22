import { ISurface } from "interfaces"
import { Rect } from "../rect"
import { GlProgram } from "./gl-program"
import { FragmnetShader, VertexShader } from "./gl-shader"
import { removeItem } from "../utils/array"


export class GlSurface implements ISurface {
  protected canvas: HTMLCanvasElement
  #rect: Rect
  private gl: WebGL2RenderingContext
  protected get ctx () { return this.gl }
  readonly programs: GlProgram[] = []

  constructor (width: number, height: number) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.#rect = new Rect(0, 0, width, height)
    this.gl = this.canvas.getContext('webgl2')!
  }
  
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
    const vertexShader = new VertexShader(this.gl, vertexShaderSource)
    const fragmnetShader = new FragmnetShader(this.gl, fragmnetShaderSource)
    const program = new GlProgram(this.gl, vertexShader, fragmnetShader)
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
    this.gl.useProgram(program.origin)
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