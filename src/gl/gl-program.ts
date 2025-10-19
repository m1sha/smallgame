import { VertexShader, FragmnetShader } from "./gl-shader"
import { type IGlUniformTypeMap, type IGlAttributeTypeMap, type DrawType } from "./types"
import { type ITextureOptions } from "./textures/texture-options"

import { GL } from "./gl"
import { SurfaceBase } from "../surface/surface-base"

export class GlProgram {
  #gl: GL
  readonly origin: WebGLProgram
  #vertexShader: VertexShader
  #fragmentShader: FragmnetShader

  constructor (gl: GL, vertexShader: VertexShader, fragmnetShader: FragmnetShader) {
    this.#gl = gl
    this.origin = this.#gl.ctx.createProgram()!
    this.#vertexShader = vertexShader
    this.#fragmentShader = fragmnetShader
  }

  create () {
    const program = this.origin
    this.#vertexShader.compile()
    this.#vertexShader.attach(program)
    this.#fragmentShader.compile()
    this.#fragmentShader.attach(program)
    this.link()
  }

  link () {
    const program = this.origin
    const gl = this.#gl.ctx

    gl.linkProgram(program)
    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) return
    
    const msg = gl.getProgramInfoLog(program) ?? ''
    this.remove()
    throw new Error(msg)
  }

  use (callback?: () => void) {
    this.#gl.use(this)
    callback?.()
  }

  remove () {
    this.#vertexShader.remove()
    this.#fragmentShader.remove()
    this.#gl.ctx.deleteProgram(this.origin)
  }
  
  /** @deprecated Use GL context directly */ uniform<K extends keyof IGlUniformTypeMap> (name: string, type: K): IGlUniformTypeMap[K] {
    return this.#gl.uniform(name, type)
  }
  /** @deprecated Use GL context directly */ attribute <K extends keyof IGlAttributeTypeMap>  (name: string, type: K): IGlAttributeTypeMap[K] {
    return this.#gl.attribute(name, type)
  }
  /** @deprecated Use GL context directly */ subData <K extends keyof IGlAttributeTypeMap> (name: string, type: K, length: number) {
    return this.#gl.subData(name, type, length)
  }
  /** @deprecated Use GL context directly */ vbo<T extends {}> (drawType: DrawType, type: 'float' | 'short' | 'byte' | 'ushort' | 'ubyte', scheme: T) {
    return this.#gl.vbo(drawType, type, scheme)
  }
  /** @deprecated Use GL context directly */ createTexture (samplerName: string, surface: SurfaceBase, options?: ITextureOptions) {
    return this.#gl.createTexture(samplerName, surface, options)
  }
}