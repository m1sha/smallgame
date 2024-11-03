export abstract class GlAttributeLocation {
  protected gl: WebGL2RenderingContext
  protected origin: number
  constructor (gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
    this.gl = gl
    this.origin = this.gl.getAttribLocation(program, name)!
  }

  get valid () {
    return this.origin > -1
  }
}
