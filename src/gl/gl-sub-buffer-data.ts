export class GlSubBufferData {
  constructor (private gl: WebGL2RenderingContext, private arr: Float32Array) {

  }

  push (n: number[], offset: number = 0) {
    this.arr.set(n, offset)
    
    return this
  }

  build () {
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.arr)
  }
}