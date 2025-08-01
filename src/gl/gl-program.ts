import { VertexShader, FragmnetShader } from "./gl-shader"
import { GlVertexArray as GlVertexBufferObject } from "./gl-vertex-array"
import { type IGlUniformTypeMap, GlUniformTypeMap, GlAttributeTypeMap, type IGlAttributeTypeMap, getGlType, getGlTypeSize, vertexOf, sizeOf, GlShape, getShape } from "./types"
import { getVertexAttribPointerTemplate } from "./utils"
import { GlTextureList, ITextureOptions } from "./gl-texture"
import { ISurface } from "../interfaces"
import { GlSubBufferData as GlSubData } from "./gl-sub-buffer-data"


export class GlProgram {
  #gl: WebGL2RenderingContext
  readonly origin: WebGLProgram
  #vertexShader: VertexShader
  #fragmentShader: FragmnetShader
  #textures: GlTextureList

  constructor (ctx: WebGL2RenderingContext, vertexShader: VertexShader, fragmnetShader: FragmnetShader) {
    this.#gl = ctx
    this.origin = this.#gl.createProgram()!
    this.#vertexShader = vertexShader
    this.#fragmentShader = fragmnetShader
    this.#textures = new GlTextureList(ctx)
  }

  create () {
    const gl = this.#gl
    const program = this.origin

    this.#vertexShader.compile()
    this.#vertexShader.attach(program)
    this.#fragmentShader.compile()
    this.#fragmentShader.attach(program)

    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    
    if (success) {
      return
    }
 
    const msg = gl.getProgramInfoLog(program) ?? ''
    gl.deleteProgram(program);
    throw new Error(msg)
  }

  uniform<K extends keyof IGlUniformTypeMap> (name: string, type: K): IGlUniformTypeMap[K] {
    return Reflect.construct(GlUniformTypeMap[type], [this.#gl, this.origin, name])
  }

  attribute <K extends keyof IGlAttributeTypeMap>  (name: string, type: K): IGlAttributeTypeMap[K] {
    return Reflect.construct(GlAttributeTypeMap[type], [this.#gl, this.origin, name])
  }

  subData <K extends keyof IGlAttributeTypeMap> (name: string, type: K, length: number) {
    const gl = this.#gl
    
    const typeSize = vertexOf(type as any) * sizeOf(type as any)
    const texCoordData = new Float32Array(typeSize * length)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, texCoordData.byteLength, gl.DYNAMIC_DRAW)

    const attr = this.attribute(name, 'pointer_array')
    attr.set(2, gl.FLOAT, false, 0, 0)
    attr.enable()

    return new GlSubData(gl, texCoordData)
  }

  vbo<T extends {}> (drawType: 'static' | 'dynamic' | 'stream', type: 'float' | 'short' | 'byte' | 'ushort' | 'ubyte', scheme: T) {
    const gl = this.#gl
    const vertextBuffer = gl.createBuffer()
    if (!vertextBuffer) throw new Error(`Can't create the vertex buffer`)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)

    const template = getVertexAttribPointerTemplate(scheme)
    const glType = getGlType(type)
    const glTypeSize = getGlTypeSize(type)
    let offset = 0
    
    for (const attr of template.attributes) {
      const pointer = this.attribute(attr.name, 'pointer_array')
      pointer.set(attr.size, glType, false, template.size * glTypeSize, offset * glTypeSize)
      offset += attr.size
      pointer.enable()
    }
    
    return new GlVertexBufferObject(this.#gl, template, drawType)
  }

  
  createTexture (samplerName: string, surface: ISurface, options?: ITextureOptions) {
    const sampler = this.uniform(samplerName, 'int')
    return this.#textures.add(sampler, surface, options ?? { minMag: 'linear' })
  }
 
}