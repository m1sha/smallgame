export abstract class GlAttributeLocation {
  protected gl: WebGL2RenderingContext
  protected origin: number
  constructor (gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
    this.gl = gl
    this.origin = this.gl.getAttribLocation(program, name)!
    if (this.origin < 0) throw new Error(`Can't get the storage location ${name}`)
  }
}
