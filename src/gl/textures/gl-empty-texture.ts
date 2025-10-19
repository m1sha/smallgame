import { TSize } from "../../size"

export class GlEmptyTexture {
  origin: WebGLTexture
  constructor (private gl: WebGL2RenderingContext, size: TSize, slot: number, onRemove: () => void) {
    this.origin = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.origin)
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGB8, size.width, size.height)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  use (callback: () => void) {
    this.bind()
    callback()
    this.unbind()
  }

  bind () {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.origin)
  }

  unbind () {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }
}