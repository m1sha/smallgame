import { ITypedArray } from "../utils"
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
  private _data: Float32Array | null = null
  private buffer: WebGLBuffer
  private glType: number
  private _len: number = 0

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

  get length () { return this._len }

  bind () {
    this.gl.bindBuffer(this.glType, this.buffer)
  }

  data (array: Float32Array, drawType: DrawType) {
    const data = new Float32Array(array)
    if (drawType === 'dynamic') {
      this._data = data
    }
    this._len = array.length
    const type = getGlDrawType(this.gl, drawType)
    this.gl.bufferData(this.glType, array, type)
  }

  subdata (array: number[] | ITypedArray, dstByteOffset: number) {
    if (!this._data) throw new Error('Draw type must be dynamic')
    this._data.set(array, dstByteOffset / Float32Array.BYTES_PER_ELEMENT)
    this.gl.bufferSubData(this.glType, dstByteOffset, this._data.subarray(dstByteOffset / Float32Array.BYTES_PER_ELEMENT))
  }

  remove () {
    this.gl.deleteBuffer(this.buffer)
  }
}