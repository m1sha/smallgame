import { type TRect } from "../rect"
import { type TPoint } from "../point"
import { FragmnetShader, FragmnetShaderSource, GL, GlProgram, u_float, vec2, VertexShader } from "../gl"
import { SurfaceBase } from "../surface/surface-base"
import { type CoordinateSystem } from "../coords"
import { type TColorSource } from "../styles/color-source"
import { Color } from "../color"

export type SurfaceGLCreateOptions = {
  useAlpha?: boolean
  useSmooth?: boolean
  useOffscreen?: boolean
  coordinateSystem?: CoordinateSystem
}

export type GlBaseParams = {
  globalAplha: u_float
  resolution: vec2
}

export abstract class SurfaceGLBase extends SurfaceBase {
  protected program: GlProgram | null = null
  protected basePrams: GlBaseParams | null = null
  readonly context: GL
  imageRendering: 'auto' | 'pixelated' = 'auto'
  vertexShader: string | null = null
  fragmnetShader: FragmnetShaderSource

  constructor(width: number, height: number, options?: SurfaceGLCreateOptions, canvas?: HTMLCanvasElement) {
    super(width, height, options && options.coordinateSystem ? options.coordinateSystem : 'screen')
    this.context = new GL({ width, height }, options && options.useOffscreen, canvas)
  
    this.fragmnetShader = new FragmnetShaderSource('')
    this.create()
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
  
  clear (rect?: TRect) {
    this.context.clear(0x0)
  }

  fill (color: TColorSource) {
    if (typeof color === 'number'){
     this.context.clear(color)
    }
      
    if (typeof color === 'string' || color instanceof String) {
      const c = Color.from(color).value
      this.context.clear(c)
    }
  }

  flip (position: 'x' | 'y' | 'xy') {
    throw new Error('Not Implement')
  }

  resize (width: number, height: number) {
    throw new Error('Not Implement')
  }

  scale (dx: number, dy: number) {
    throw new Error('Not Implement')
  }

  rotate (a: number, pivot?: TPoint) {
    throw new Error('Not Implement')
  }

  setCanvasSize  (width: number, height: number, shiftToCenter: boolean = true) {
    throw new Error('Not Implement')
  }

  clone (): SurfaceBase {
    throw new Error('Not Implement')
  }

  release () {
    if (!this.program) return
    this.context.ctx.deleteProgram(this.program.origin)
  }

  get globalAlpha () {
    if (!this.basePrams) throw new Error('Surface is not created.')
    return this.basePrams.globalAplha.value
  }

  set globalAlpha (value: number) {
    if (!this.basePrams) throw new Error('Surface is not created.')
    this.basePrams.globalAplha.value = value
  }
}