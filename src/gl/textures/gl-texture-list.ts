import { GlTexture } from "./gl-texture"
import { type ITextureOptions } from "./texture-options"
import { u_int } from "../types"
import { GlTextureArray } from "./gl-texture-array"
import { SurfaceBase } from "../../surface/surface-base"
import { type TSize } from "../../size"
import { GlEmptyTexture } from "./gl-empty-texture"

export class GlTextureList {
  #gl: WebGL2RenderingContext
  #slot: number = 0

  constructor (gl: WebGL2RenderingContext) {
    this.#gl = gl
  }

  addTexture2D (sampler: u_int, surface: SurfaceBase, options: ITextureOptions) {
    const result = new GlTexture(this.#gl, this.#slot, () => this.#slot--, options)
    result.bind(surface)    
    sampler.value = this.#slot
    this.#slot++
    return result
  }

  addTextureArray (sampler: u_int, surfaces: SurfaceBase[], options: ITextureOptions) {
    const result = new GlTextureArray(this.#gl, this.#slot, () => this.#slot--, options)
    result.bind(surfaces)   
    sampler.value = this.#slot
    this.#slot++
    return result
  }

  addEmptyTexture (sampler: u_int, size: TSize) {
    const result = new GlEmptyTexture(this.#gl, size, this.#slot, () => this.#slot--)
    result.bind()   
    sampler.value = this.#slot
    this.#slot++
    return result
  }
}