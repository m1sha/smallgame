import { Surface } from "../surface"
import { TextureSlots, u_int } from "./types"

export class GlTexture {

}

export class GlTextureList {
  #gl: WebGL2RenderingContext
  #slot: number = 0

  constructor (gl: WebGL2RenderingContext) {
    this.#gl = gl
  }

  add (sampler: u_int, surface: Surface) {
    const gl = this.#gl
    const texture = gl.createTexture()
    if (!texture) throw new Error(`Can't create a texture.`)

   
    
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.activeTexture(TextureSlots[this.#slot]) // options.slot
    gl.bindTexture(gl.TEXTURE_2D, texture)
    //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface.draw.origin.canvas)
    //gl.generateMipmap(gl.TEXTURE_2D)
    sampler.value = this.#slot

    this.#slot++
  }
}