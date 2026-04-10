import { GlBuffer } from "./gl-buffer"
import { a_pointer_array, DrawType } from "./types"

export class GlPointerArrayBufferObject {
  constructor (
    private gl: WebGL2RenderingContext, 
    private buffer: GlBuffer, 
    private pointer: a_pointer_array, 
    private size: number, 
    private drawType: DrawType
  ) {
  }

  push (n: number[]) {
    this.buffer.data(new Float32Array(n), this.drawType)
    return this.vertextCount
  }

  set (n: number[], dstByteOffset: number = 0) {
    const data = new Float32Array(n)
    this.buffer.bind()
    this.buffer.subdata(data, dstByteOffset)
    return this
  }

  div (n: number) {
    if (this.pointer)
    this.gl.vertexAttribDivisor(this.pointer.origin, n)
    return this
  }

  get vertextCount () {
    return this.buffer.length / this.size
  }
}