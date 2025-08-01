export type GlBufferType = 
  | 'array'
  | 'element-array'
  | 'copy-read'
  | 'copy-write'
  | 'pixel-pack'
  | 'pixel-unpack'
  | 'transform-feedback'
  | 'uniform'


export class GlBuffer {
  private buffer: WebGLBuffer
  private glType: number

  constructor (private gl: WebGL2RenderingContext, type: GlBufferType) {
    this.buffer = gl.createBuffer()
    this.glType = 0
    switch (type) {
      case 'array': this.glType = gl.ARRAY_BUFFER; break
      case 'element-array': this.glType = gl.ARRAY_BUFFER; break
      case 'copy-read': this.glType = gl.ARRAY_BUFFER; break
      case 'copy-write': this.glType = gl.ARRAY_BUFFER; break
      case 'pixel-pack': this.glType = gl.ARRAY_BUFFER; break
      case 'pixel-unpack': this.glType = gl.ARRAY_BUFFER; break
      case 'transform-feedback': this.glType = gl.ARRAY_BUFFER; break
      case 'uniform': this.glType = gl.ARRAY_BUFFER; break
    }
  }

  bind () {
    this.gl.bindBuffer(this.glType, this.buffer)
  }

  data (array: Float32Array, drawType: 'static' | 'dynamic' | 'stream') {
    const type = drawType === 'dynamic' ? this.gl.DYNAMIC_DRAW : drawType === 'stream' ? this.gl.STREAM_DRAW : this.gl.STATIC_DRAW
    this.gl.bufferData(this.glType, array, type)
  }

  remove () {
    this.gl.deleteBuffer(this.buffer)
  }
}