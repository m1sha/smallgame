import { type TRect } from "../rect"
import { type TPoint } from "../point"
import { FragmnetShaderSource, GL, GlProgram, u_float, u_vec2 } from "../gl"
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
  resolution: u_vec2
}

export abstract class SurfaceGLBase extends SurfaceBase {
  private program: GlProgram | null = null
  private created: boolean = false
  protected basePrams: GlBaseParams | null = null
  readonly context: GL
  imageRendering: 'auto' | 'pixelated' = 'auto'
  vertexShader: string | null = null
  fragmnetShader: FragmnetShaderSource

  constructor(width: number, height: number, options?: SurfaceGLCreateOptions, canvas?: HTMLCanvasElement) {
    super(width, height, options && options.coordinateSystem ? options.coordinateSystem : 'screen')
    this.context = new GL({ width, height }, options && options.useOffscreen, canvas)
    this.fragmnetShader = new FragmnetShaderSource('')
  }

  protected get canvas () { return this.context.canvas }

  create (): void {
    if (this.created) return
    this.created = true

    this.program = this.context.createProgram(this.vertexShader ?? this.defaultVerSource, this.fragmnetShader.toString() ?? this.defaultFragSource, 'assemble-and-use')
    const resolution = this.context.uniform('iResolution', 'vec2')
    resolution.value = [this.width, this.height]
    const globalAplha = this.context.uniform('uGlobalAlpha', 'float')
    globalAplha.value = 1
    
    this.basePrams = {
      globalAplha,
      resolution
    }
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

  flipSelf (position: 'x' | 'y' | 'xy') {
    throw new Error('Not Implement')
  }

  resize (width: number, height: number) {
    throw new Error('Not Implement')
  }

  resizeSelf (width: number, height: number) {
    throw new Error('Not Implement')
  }

  scale (dx: number, dy: number) {
    throw new Error('Not Implement')
  }

  scaleSelf (dx: number, dy: number) {
    throw new Error('Not Implement')
  }

  rotateSelf (a: number, pivot?: TPoint) {
    throw new Error('Not Implement')
  }

  setCanvasSize  (width: number, height: number) {
    this.basePrams!.resolution.value = [width, height]
    this.rect.resizeSelf({ width, height })
    this.context.viewport({ width, height })
  }

  clone (): SurfaceBase {
    throw new Error('Not Implement')
  }

  remove () {
    this.created = false
    this.program?.remove()
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