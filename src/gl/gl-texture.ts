import { ISurface } from "../interfaces"
import { Surface } from "../surface"
import { TextureSlots, u_int } from "./types"

export interface IMipmapOptions {
  level?: number
  maxLevel?: number
  baseLevel?: number
}

export interface ITextureOptions {
  minMag: 'nearest' | 'linear'
  mipmap?: IMipmapOptions
  wrapS?: 'repeat' | 'mirrored-repeat' | 'clamp-to-edge'
  wrapT?: 'repeat' | 'mirrored-repeat' | 'clamp-to-edge'
  flipY?: boolean
  flipX?: boolean
}

export class GlTexture {
  #gl: WebGL2RenderingContext
  #texture: WebGLTexture
  #onRemove: () => void
  #slot: number
  #options: ITextureOptions

  constructor (gl: WebGL2RenderingContext, slot: number, onRemove: () => void, options: ITextureOptions) {
    this.#gl = gl
    this.#slot = slot
    this.#onRemove = onRemove
    this.#options = options
    const tex = gl.createTexture()
    if (!tex) throw new Error(`Can't create a texture.`)
    this.#texture = tex
  }

  activate (surface: ISurface) {
    const gl = this.#gl
    const texture = this.#texture

    if (!this.#options.flipY)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.activeTexture(TextureSlots[this.#slot]) // options.slot
    gl.bindTexture(gl.TEXTURE_2D, texture)
    //gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, surface.width, surface.height)

    gl.enable(gl.BLEND)
    //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    if (this.#options.minMag === 'nearest') {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    }
    if (this.#options.minMag === 'linear') {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
      //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST)
    }

    if (this.#options.mipmap) {
      const { maxLevel: mipmapMaxLevel, baseLevel: mipmapBaseLevel } = this.#options.mipmap
      if (typeof mipmapMaxLevel === 'number') gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, mipmapMaxLevel)
      if (typeof mipmapBaseLevel === 'number') gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, mipmapBaseLevel)
    }

    const mipmapLevel = this.#options.mipmap && typeof this.#options.mipmap.level === 'number' ? this.#options.mipmap.level : 0

    if (this.#options.wrapS) {
      const wrap = this.#options.wrapS
      const val = wrap === 'repeat' ? gl.REPEAT : (wrap === 'mirrored-repeat' ? gl.MIRRORED_REPEAT : gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, val)
    }

    if (this.#options.wrapT) {
      const wrap = this.#options.wrapT
      const val = wrap === 'repeat' ? gl.REPEAT : (wrap === 'mirrored-repeat' ? gl.MIRRORED_REPEAT : gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, val)
    }
    
    if (surface instanceof Surface)
      gl.texImage2D(gl.TEXTURE_2D, mipmapLevel, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface.draw.origin.canvas)
    else
      gl.texImage2D(gl.TEXTURE_2D, mipmapLevel, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, (surface as any).origin)

    gl.generateMipmap(gl.TEXTURE_2D)
  }

  update (surface:  ISurface) {
    const gl = this.#gl
    const texture = this.#texture

    gl.bindTexture(gl.TEXTURE_2D, texture)
    
    if (surface instanceof Surface)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface.draw.origin.canvas)
    else
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, (surface as any).origin)
  }
 
  delete () {
    this.#gl.deleteTexture(this.#texture)
    this.#onRemove()
  }
}

export class GlTextureList {
  #gl: WebGL2RenderingContext
  #slot: number = 0

  constructor (gl: WebGL2RenderingContext) {
    this.#gl = gl
  }

  add (sampler: u_int, surface: ISurface, options: ITextureOptions) {
    const result = new GlTexture(this.#gl, this.#slot, () => this.#slot--, options)
    result.activate(surface)    
    //gl.generateMipmap(gl.TEXTURE_2D)
    sampler.value = this.#slot
    this.#slot++
    return result
  }
}