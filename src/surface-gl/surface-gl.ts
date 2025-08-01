import { Rect, TRect } from "../rect"
import { TPoint } from "../point"
import { ISurface } from "../interfaces"
import { FragmnetShader, GlProgram, IGlUniformTypeMap, Primitive2D, TexCoord, u_mat3, u_mat4, vec2, VertexShader } from "../gl"
import { FragmnetShaderSource } from "./fragmnet-shader-source"
import defaultVerSource from './default-shaders/vert'
import defaultFragSource from './default-shaders/frag'
import { GlTexture } from "../gl/gl-texture"
import { Surface } from "../surface"

export type SurfaceGLCreateOptions = {
  useAlpha?: boolean
  useSmooth?: boolean
  useOffscreen?: boolean
}

export class SurfaceGL implements ISurface {
  protected canvas: HTMLCanvasElement | OffscreenCanvas
  protected ctx: WebGL2RenderingContext 
  protected program: GlProgram | null = null
  protected transform: u_mat4 | null = null
  protected texTransform: u_mat4 | null = null
  protected texture: GlTexture | null = null
  #rect: Rect
  vertexShader: string | null = null
  fragmnetShader: FragmnetShaderSource
  imageRendering:  'auto' | 'pixelated' = 'auto'

  constructor(width: number, height: number, options?: SurfaceGLCreateOptions, canvas?: HTMLCanvasElement) {
    this.canvas = canvas ? canvas : options && options.useOffscreen ? new OffscreenCanvas(width, height) : document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.#rect = new Rect(0, 0, width, height)
    const ctx = this.canvas.getContext('webgl2')!
    if (!ctx) throw new Error('webgl2 is unsupported')
    this.ctx = ctx
    this.fragmnetShader = new FragmnetShaderSource('')
  }

  clear () {
    if (this.program) this.program.clear()
  }

  blit (surface: ISurface, rect: TRect | TPoint, srcRect?: TRect) {
    if (!this.program || !this.texture) throw new Error('Surface is not created.')
    
    this.texture.update(surface)

    const r = new Rect(rect.x, rect.y, surface.width, surface.height)
    const isRect = rect as TRect 
    if (typeof isRect.width === 'number' && typeof isRect.height === 'number') {
      r.resizeSelf(isRect)      
    }
    
    this.drawTex(r, surface.width, surface.height, srcRect)
  }

  create () {
    const ver = new VertexShader(this.ctx, this.vertexShader ?? defaultVerSource)
    const frag = new FragmnetShader(this.ctx, this.fragmnetShader.toString() ?? defaultFragSource)
    this.program = new GlProgram(this.ctx, ver, frag)
    this.program.create()
    this.ctx.useProgram(this.program.origin)
    
    this.uniform('iResolution', 'vec2').value = [this.width, this.height]
    this.transform = this.uniform('uMatrix', 'mat4')
    this.transform.set(new DOMMatrix([1, 0, 0, 1, 0, 0]))
    this.texTransform = this.uniform('uTexTransform', 'mat4')
    this.texTransform.set(new DOMMatrix([1, 0, 0, 1, 0, 0]))
    this.texture = this.program.createTexture('uSampler', Surface.default, { minMag: 'nearest' })
  }


  vertexArray<T extends {}> (type: 'float' | 'short' | 'byte' | 'ushort' | 'ubyte', scheme: T) {
    if (!this.program) throw new Error('Surface is not created.')
    this.program.vbo('static', type, scheme)
  }

  drawRect () {
    if (!this.program) throw new Error('Surface is not created.')
    const vertexCount = this.program
      .vbo('static', 'float', { aPosition: vec2 })
      .push(Primitive2D.rect())
    this.program.drawArrays('triangle-strip', vertexCount)
  }

  private drawTex (rect: TRect, imgWidth: number, imgHeight: number, srcRect?: TRect) {
    if (!this.program) throw new Error('Surface is not created.')
    const vertexCount = this.program
      .vbo('static', 'float', { a_Position: vec2, a_TexCoord: vec2 })
      .push(Primitive2D.rect(), TexCoord.rect())

    const transform = new DOMMatrix([1, 0, 0, 1, 0, 0])
      .translate((rect.x + rect.width * 0.5 ) / (this.width * 0.5), ( -rect.height * 0.5 - rect.y) / (this.height * 0.5 ))
      .scale(rect.width / this.width, rect.height / this.height)

    const texTransform = new DOMMatrix([1, 0, 0, 1, 0, 0])
    
    if (srcRect) {
      texTransform
        .translateSelf(srcRect.x / (imgWidth), (-srcRect.height - srcRect.y) / (imgHeight))
        .scaleSelf(srcRect.width / (imgWidth), srcRect.height / (imgHeight))
    }
    
    this.transform?.set(transform)
    this.texTransform?.set(texTransform)
    
    this.program.drawArrays('triangle-strip', vertexCount)
  }

  release () {
    if (!this.program) return
    this.ctx.deleteProgram(this.program.origin)
  }

  get rect () { return this.#rect }
  get width () { return this.#rect.width }
  get height () { return this.#rect.height }

  uniform <K extends keyof IGlUniformTypeMap> (name: string, type: K): IGlUniformTypeMap[K] {
    return this.program!.uniform(name, type)
  }
}