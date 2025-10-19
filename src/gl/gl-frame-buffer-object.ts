import { GlEmptyTexture } from "./textures"

export class FrameBufferObject {
  origin: WebGLFramebuffer

  constructor (private gl: WebGL2RenderingContext) {
    this.origin = gl.createFramebuffer()
  }

  use (callback: () => void) {
    this.bind()
    callback()
    this.unbind()
  }

  bind () {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.origin)
  }

  defineTexture (tex: GlEmptyTexture) {
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, tex.origin, 0)
    this.gl.drawBuffers([ this.gl.COLOR_ATTACHMENT0 ]);
  }

  unbind () {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  remove () {
    this.gl.deleteFramebuffer(this.origin)
  }
}