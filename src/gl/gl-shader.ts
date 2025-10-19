export type GlShaderType = 'vertex' | 'fragmnet'

export abstract class GlShader {
  #gl: WebGL2RenderingContext
  
  readonly type: GlShaderType
  readonly origin: WebGLShader

  constructor (gl: WebGL2RenderingContext, type: GlShaderType, source: string = '') {
    this.#gl = gl
    this.origin = gl.createShader(type === 'vertex' ? gl.VERTEX_SHADER: gl.FRAGMENT_SHADER)!
    this.type = type
    if (source) this.setSource(source)
  }

  
  setSource (value: string) {
    this.#gl.shaderSource(this.origin, '#version 300 es\nprecision mediump float;' + value)
  }

  compile () {
    const shader = this.origin
    const gl = this.#gl

    gl.compileShader(shader)
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    
    if (success) {
      //  
      return
    }
  
    const msg = gl.getShaderInfoLog(shader) ?? ''
    gl.deleteShader(shader)
    throw new Error(msg)
  }

  attach (program: WebGLProgram) {
    this.#gl.attachShader(program, this.origin)
  }

  remove () {
    this.#gl.deleteShader(this.origin)
  }
}

export class VertexShader extends GlShader { 
  constructor (gl: WebGL2RenderingContext, source: string = '') {
    super(gl, 'vertex', source)
  }
}

export class FragmnetShader extends GlShader { 
  constructor (gl: WebGL2RenderingContext, source: string = '') {
    super(gl, 'fragmnet', source)
  }
}
