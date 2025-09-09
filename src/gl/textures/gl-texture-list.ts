import { GlTexture } from "./gl-texture"
import { ITextureOptions } from "./texture-options"
import { u_int } from "../types"
import { GlTextureArray } from "./gl-texture-array"
import { SurfaceBase } from "../../surface/surface-base"

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
}