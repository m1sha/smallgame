import { GlVertexBufferObject } from "./gl-vertex-buffer-object";

export class GlVertexArrayObject {
  constructor (private ctx: WebGL2RenderingContext, private vaoId: WebGLVertexArrayObject, private vbo: GlVertexBufferObject) {
    
  }

  get vertexCount () { return this.vbo.count }

  bind () {
    this.ctx.bindVertexArray(this.vaoId)
  }

  unbind () {
    this.ctx.bindVertexArray(null)
  }

  remove () {
    this.vbo.remove()
    this.ctx.deleteVertexArray(this.vaoId)
  }

  use (callback: () => void) {
    this.bind()
    callback()
    this.unbind()
  }

  update (...items: Array<number[]>) {
    this.vbo.push(...items)
  }
}