export abstract class GlUniformLocation {
  protected gl: WebGL2RenderingContext
  protected origin: WebGLUniformLocation
  protected program: WebGLProgram

  constructor (gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
    this.gl = gl
    this.program = program
    this.origin = this.gl.getUniformLocation(program, name)!
  }

  get valid () {
    return Boolean(this.origin)
  }
}