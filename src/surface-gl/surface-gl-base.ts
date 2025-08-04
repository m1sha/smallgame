import { Rect } from "../rect"
import { FragmnetShader, FragmnetShaderSource, GL, GlProgram, u_float, vec2, VertexShader } from "../gl"

export type SurfaceGLCreateOptions = {
  useAlpha?: boolean
  useSmooth?: boolean
  useOffscreen?: boolean
}

export type GlBaseParams = {
  globalAplha: u_float
  resolution: vec2
}

export abstract class SurfaceGLBase {
  protected program: GlProgram | null = null
  protected basePrams: GlBaseParams | null = null
  readonly context: GL
  imageRendering: 'auto' | 'pixelated' = 'auto'
  vertexShader: string | null = null
  fragmnetShader: FragmnetShaderSource
  #rect: Rect

  constructor(width: number, height: number, options?: SurfaceGLCreateOptions, canvas?: HTMLCanvasElement) {
    this.context = new GL({ width, height }, options && options.useOffscreen, canvas)
    this.#rect = new Rect(0, 0, width, height)
    this.fragmnetShader = new FragmnetShaderSource('')
  }

  create (): void {
    const ver = new VertexShader(this.context.ctx, this.vertexShader ?? this.defaultVerSource)
    const frag = new FragmnetShader(this.context.ctx, this.fragmnetShader.toString() ?? this.defaultFragSource)
    this.program = new GlProgram(this.context, ver, frag)
    
    this.program.create()
    this.context.use(this.program)

    const resolution = this.context.uniform('iResolution', 'vec2')
    resolution.value = [this.width, this.height]
    const globalAplha = this.context.uniform('uGlobalAlpha', 'float')
    globalAplha.value = 1
    
    this.basePrams = {
      globalAplha,
      resolution
    }
  }

  /** @deprecated use origin */
  protected get canvas (): HTMLCanvasElement | OffscreenCanvas {
    return this.origin
  }

  protected get origin (): HTMLCanvasElement | OffscreenCanvas {
    return this.context.canvas
  }
  
  protected get ctx () {
    return this.context.ctx
  }

  protected abstract get defaultVerSource (): string
  protected abstract get defaultFragSource (): string
  
  clear () {
    this.context.clear()
  }

  release () {
    if (!this.program) return
    this.context.ctx.deleteProgram(this.program.origin)
  }

  get rect () { return this.#rect }
  get width () { return this.#rect.width }
  get height () { return this.#rect.height }

  get globalAlpha () {
    if (!this.basePrams) throw new Error('Surface is not created.')
    return this.basePrams.globalAplha.value
  }

  set globalAlpha (value: number) {
    if (!this.basePrams) throw new Error('Surface is not created.')
    this.basePrams.globalAplha.value = value
  }
}