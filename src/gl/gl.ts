import { type TSize } from "../size"
import { GlProgram } from "./gl-program"
import { FragmnetShader, VertexShader } from "./gl-shader"
import { DrawType, getGlType, getGlTypeSize, getShape, GlAttributeTypeMap, GlUniformTypeMap, IGlAttributeTypeMap, IGlUniformTypeMap, sizeOf, vertexOf, type GlShape } from "./types"
import { getVertexAttribPointerTemplate } from "./utils"
import { GlVertexBufferObject } from "./gl-vertex-buffer-object"
import { ISurface } from "../interfaces"
import { GlTextureList, ITextureOptions } from "./gl-texture"
import { GlBufferSubData } from "./gl-sub-buffer-data"
import { GlBuffer } from "./gl-buffer"

export class GL {
  #prog: GlProgram | undefined = undefined
  readonly canvas: HTMLCanvasElement | OffscreenCanvas
  readonly ctx: WebGL2RenderingContext
  #textures: GlTextureList

  constructor (viewportSize: TSize, offscreen: boolean = false, canvas?: HTMLCanvasElement) {
    this.canvas = canvas ? canvas : offscreen ? new OffscreenCanvas(viewportSize.width, viewportSize.height) : document.createElement('canvas')
    this.canvas.width = viewportSize.width
    this.canvas.height = viewportSize.height
    this.ctx = this.canvas.getContext('webgl2')!
    this.#textures = new GlTextureList(this.ctx)
  }

  get available () {
    return Boolean(this.ctx) && Boolean(this.#prog)
  }

  clear () {
    const gl = this.ctx
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    //gl.colorMask(true, true, true, false)
  }

  drawArrays (type: GlShape = 'points', vertexCount: number = 1, offset: number = 0) {
    const gl = this.ctx
    const shape = getShape(gl, type)
    gl.drawArrays(shape, offset, vertexCount)
  }

  use (prog: GlProgram) {
    this.#prog = prog
    this.ctx.useProgram(prog.origin)
  }

  viewport (size: TSize) {
    this.ctx.viewport(0, 0, size.width, size.width)
  }

  createProgram (vss: string, fss: string, options: 'default' | 'assemble' | 'assemble-and-use' = 'default') {
    const prog = new GlProgram(this, new VertexShader(this.ctx, vss), new FragmnetShader(this.ctx, fss))
    if (options.startsWith('assemble')) prog.create()
    if (options === 'assemble-and-use') this.use(prog)
    return prog
  }

  createTransformFeedback () {
    this.ctx.createTransformFeedback()
  }

  uniform<K extends keyof IGlUniformTypeMap> (name: string, type: K): IGlUniformTypeMap[K] {
    return Reflect.construct(GlUniformTypeMap[type], [this.ctx, this.#prog!.origin, name])
  }

  attribute <K extends keyof IGlAttributeTypeMap> (name: string, type: K): IGlAttributeTypeMap[K] {
    return Reflect.construct(GlAttributeTypeMap[type], [this.ctx, this.#prog!.origin, name])
  }

  subData <K extends keyof IGlAttributeTypeMap> (name: string, type: K, length: number) {
    const gl = this.ctx
    
    const typeSize = vertexOf(type as any) * sizeOf(type as any)
    const texCoordData = new Float32Array(typeSize * length)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, texCoordData.byteLength, gl.DYNAMIC_DRAW)

    const attr = this.attribute(name, 'pointer_array')
    attr.set(2, gl.FLOAT, false, 0, 0)
    attr.enable()

    return new GlBufferSubData(gl, texCoordData)
  }

  vbo<T extends {}> (drawType: DrawType, type: 'float' | 'short' | 'byte' | 'ushort' | 'ubyte', scheme: T) {
    const gl = this.ctx
    const buffer = new GlBuffer(gl, 'array')
    buffer.bind()

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
    
    return new GlVertexBufferObject(buffer, template, drawType)
  }

  
  createTexture (samplerName: string, surface: ISurface, options?: ITextureOptions) {
    const sampler = this.uniform(samplerName, 'int')
    return this.#textures.add(sampler, surface, options ?? { minMag: 'linear' })
  }
}