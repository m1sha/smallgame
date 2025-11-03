export class PixelBufferObject {
  origin: WebGLBuffer

  constructor (private gl: WebGL2RenderingContext) {
    this.origin = gl.createBuffer()
  }

  setData (data: ImageDataArray) {
    this.bind()
    this.gl.bufferData(this.gl.PIXEL_UNPACK_BUFFER, data, this.gl.STATIC_DRAW)
    this.unbind()
  }

  bind () {
    this.gl.bindBuffer(this.gl.PIXEL_UNPACK_BUFFER, this.origin)
  }

  unbind () {
    this.gl.bindBuffer(this.gl.PIXEL_UNPACK_BUFFER, null)
  }
}