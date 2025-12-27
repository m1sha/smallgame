import { TextureSlots } from "../types"
import { type ITextureOptions } from "./texture-options"

export abstract class TextureBase {
  protected gl: WebGL2RenderingContext
  protected texture: WebGLTexture
  protected onRemove: () => void
  protected slot: number
  protected options: ITextureOptions
  
  constructor (gl: WebGL2RenderingContext, slot: number, onRemove: () => void, options: ITextureOptions) {
    this.gl = gl
    this.slot = slot
    this.onRemove = onRemove
    this.options = options
    const tex = gl.createTexture()
    if (!tex) throw new Error(`Can't create a texture.`)
    this.texture = tex
  }

  activate () {
    this.gl.activeTexture(TextureSlots[this.slot]) // options.slot
  }

  remove () {
    this.gl.deleteTexture(this.texture)
    this.onRemove()
  }

  protected abstract type: number

  protected activateParameters () {
    //gl.texStorage2D(this.type, 1, gl.RGBA8, surface.width, surface.height)
    this.flipY()
    this.alpha()
    this.minMag()
    const level = this.mipmap()
    this.wrap()
    return level
  }

  private flipY () {
    if (!this.options.flipY)
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1)
  }

  private alpha () {
    this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
  }

  private minMag () {
    if (this.options.minMag === 'nearest') {
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
    }
    if (this.options.minMag === 'linear') {
      this.gl.texParameteri(this.type, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST)
      //gl.texParameteri(this.type, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST)
    }
      
    if (this.options.mipmap) {
      const { maxLevel: mipmapMaxLevel, baseLevel: mipmapBaseLevel } = this.options.mipmap
      if (typeof mipmapMaxLevel === 'number') this.gl.texParameteri(this.type, this.gl.TEXTURE_MAX_LEVEL, mipmapMaxLevel)
      if (typeof mipmapBaseLevel === 'number') this.gl.texParameteri(this.type, this.gl.TEXTURE_BASE_LEVEL, mipmapBaseLevel)
    }
  }

  private mipmap () {
    const level = this.options.mipmap && typeof this.options.mipmap.level === 'number' ? this.options.mipmap.level : 0
    if (this.options.mipmap){
      this.gl.generateMipmap(this.type)
    }
    return level
  }

  private wrap () {
    if (this.options.wrapS) {
      const wrap = this.options.wrapS
      const val = wrap === 'repeat' ? this.gl.REPEAT : (wrap === 'mirrored-repeat' ? this.gl.MIRRORED_REPEAT : this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.type, this.gl.TEXTURE_WRAP_S, val)
    }

    if (this.options.wrapT) {
      const wrap = this.options.wrapT
      const val = wrap === 'repeat' ? this.gl.REPEAT : (wrap === 'mirrored-repeat' ? this.gl.MIRRORED_REPEAT : this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.type, this.gl.TEXTURE_WRAP_S, val)
    }
  }
}