import { Rect, TRect } from "../rect"
import { TPoint } from "../point"
import { ISurface } from "../interfaces"
import { IGlUniformTypeMap, Primitive2D, TexCoord, u_float, u_int, u_mat4, vec2, VertexShader } from "../gl"
import defaultVerSource from './shaders/default/vert'
import defaultFragSource from './shaders/default/frag'
import { GlTexture } from "../gl/gl-texture"
import { Surface } from "../surface"
import { SurfaceGLBase } from "./surface-gl-base"

type GlParams = {
  transform: u_mat4
  texTransform: u_mat4
  texture: GlTexture
}

export class SurfaceGL extends SurfaceGLBase {
  protected glParams: GlParams | null = null

  blit (surface: ISurface, rect: TRect | TPoint, srcRect?: TRect) {
    if (!this.program || !this.glParams) throw new Error('Surface is not created.')
    
    this.glParams.texture.update(surface)

    const r = new Rect(rect.x, rect.y, surface.width, surface.height)
    const isRect = rect as TRect 
    if (typeof isRect.width === 'number' && typeof isRect.height === 'number') {
      r.resizeSelf(isRect)      
    }
    
    this.draw(r, surface.width, surface.height, srcRect)
  }

  blita (alpha: number, surface: ISurface, rect: TRect | TPoint, srcRect?: TRect) {
    const oldAlpha = this.globalAlpha
    this.globalAlpha = alpha
    this.blit(surface, rect, srcRect)
    this.globalAlpha = oldAlpha
  }

  create () {
    super.create()
    
    this.glParams = {
      transform: this.uniform('uMatrix', 'mat4', new DOMMatrix().toFloat32Array()),
      texTransform: this.uniform('uTexTransform', 'mat4', new DOMMatrix().toFloat32Array()),
      texture: this.context.createTexture('uSampler', Surface.default, { minMag: this.imageRendering === 'pixelated' ? 'nearest' : 'linear' }),
    }
  }

  protected get defaultVerSource () { return defaultVerSource }
  protected get defaultFragSource () { return defaultFragSource }

  private draw (rect: TRect, imgWidth: number, imgHeight: number, srcRect?: TRect) {
    const vertexCount = this.context
      .vbo('static', 'float', { a_Position: vec2, a_TexCoord: vec2 })
      .push(Primitive2D.rect(), TexCoord.rect())

    const transform = new DOMMatrix()
      .translate((rect.x + rect.width * 0.5 ) / (this.width * 0.5), ( -rect.height * 0.5 - rect.y) / (this.height * 0.5 ))
      .scale(rect.width / this.width, rect.height / this.height)

    const texTransform = new DOMMatrix()
    
    if (srcRect) {
      texTransform
        .translateSelf(srcRect.x / (imgWidth), (-srcRect.height - srcRect.y) / (imgHeight))
        .scaleSelf(srcRect.width / (imgWidth), srcRect.height / (imgHeight))
    }
    
    this.glParams?.transform.set(transform)
    this.glParams?.texTransform.set(texTransform)
    
    this.context.drawArrays('triangle-strip', vertexCount)
  }

  private uniform <K extends keyof IGlUniformTypeMap> (name: string, type: K, value?: any): IGlUniformTypeMap[K] {
    const result = this.context.uniform(name, type)
    if (typeof value !== 'undefined' && value !== undefined) result.value = value
    return result
  }
}