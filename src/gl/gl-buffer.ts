import { type DrawType, getGlDrawType } from "./types"

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
    const buffer = gl.createBuffer()
    if (!buffer) throw new Error('Budder can not be created.')
      
    this.buffer = buffer
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

  data (array: Float32Array, drawType: DrawType) {
    const type = getGlDrawType(this.gl, drawType)
    this.gl.bufferData(this.glType, array, type)
  }

  remove () {
    this.gl.deleteBuffer(this.buffer)
  }
}