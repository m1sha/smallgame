import { type TSize } from "../size"
import { GlProgram } from "./gl-program"
import { FragmnetShader, VertexShader } from "./gl-shader"
import { __blendFuncDic, type BlendFunc, type DrawType, getGlType, getGlTypeSize, getShape, GlAttributeTypeMap, GlUniformTypeMap, IGlAttributeTypeMap, IGlUniformTypeMap, sizeOf, vertexOf, type GlShape, type GLSLTypes } from "./types"
import { getVertexAttribPointerTemplate } from "./utils"
import { GlVertexBufferObject } from "./gl-vertex-buffer-object"
import { GlEmptyTexture, GlTextureList, ITextureOptions } from "./textures"
import { GlBufferSubData } from "./gl-sub-buffer-data"
import { GlBuffer } from "./gl-buffer"
import { GlVertexArrayObject } from "./gl-vertex-array-object"
import { SurfaceBase } from "../surface/surface-base"
import { FrameBufferObject } from "./gl-frame-buffer-object"
import { RenderBufferObject } from "./gl-render-buffer-object"
import { SurfaceGL } from "../surface-gl"
import { SurfaceGLCreateOptions } from "../surface-gl/surface-gl-base"
import { PixelBufferObject } from "./pixel-buffer-object"

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

  clear (rgba: number) {
    const gl = this.ctx
    const color = (c: number) => ((rgba >> c) & 0xff) / 255
    gl.clearColor(color(24), color(16), color(8), color(0))
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.colorMask(true, true, true, true)
  }

  enableBlend () { this.ctx.enable(this.ctx.BLEND) }
  enableCullFace () { this.ctx.enable(this.ctx.CULL_FACE) }
  enableDepth () { this.ctx.enable(this.ctx.DEPTH_TEST) }
  enableDither () { this.ctx.enable(this.ctx.DITHER) }
  enablePolygonOffsetFill () { this.ctx.enable(this.ctx.POLYGON_OFFSET_FILL) }
  enableSampleAlphaToCoverage () { this.ctx.enable(this.ctx.SAMPLE_ALPHA_TO_COVERAGE) }
  enableSampleCoverage () { this.ctx.enable(this.ctx.SAMPLE_COVERAGE) }
  enableScissor () { this.ctx.enable(this.ctx.SCISSOR_TEST) }
  enableStencil () { this.ctx.enable(this.ctx.STENCIL_TEST) }
  
  disableBlend () { this.ctx.disable(this.ctx.BLEND) }
  disableCullFace () { this.ctx.disable(this.ctx.CULL_FACE) }
  disableDepth () { this.ctx.disable(this.ctx.DEPTH_TEST) }
  disableDither () { this.ctx.disable(this.ctx.DITHER) }
  disablePolygonOffsetFill () { this.ctx.disable(this.ctx.POLYGON_OFFSET_FILL) }
  disableSampleAlphaToCoverage () { this.ctx.disable(this.ctx.SAMPLE_ALPHA_TO_COVERAGE) }
  disableSampleCoverage () { this.ctx.disable(this.ctx.SAMPLE_COVERAGE) }
  disableScissor () { this.ctx.disable(this.ctx.SCISSOR_TEST) }
  disableStencil () { this.ctx.disable(this.ctx.STENCIL_TEST) }

  useBlend (callback: () => void) { this.enableBlend(); callback(); this.disableBlend() }
  useCullFace (callback: () => void) { this.enableCullFace(); callback(); this.disableCullFace() }
  useDepth (callback: () => void) { this.enableDepth(); callback(); this.disableDepth() }


  scissor (size: TSize) {
    this.ctx.scissor(0, 0, size.width, size.width)
  }

  blendFunc (sfactor: BlendFunc, dfactor: BlendFunc) {
    this.ctx.blendFunc(__blendFuncDic[sfactor], __blendFuncDic[dfactor])
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
    this.ctx.canvas.width = size.width
    this.ctx.canvas.height = size.height
    this.ctx.viewport(0, 0, size.width, size.height)
  }

  createProgram (vss: string, fss: string, options: 'default' | 'assemble' | 'assemble-and-use' = 'default') {
    const prog = new GlProgram(this, new VertexShader(this.ctx, vss), new FragmnetShader(this.ctx, fss))
    if (options.startsWith('assemble')) prog.create()
    if (options === 'assemble-and-use') this.use(prog)
    return prog
  }

  fbo (texture: GlEmptyTexture): FrameBufferObject {
    const result = new FrameBufferObject(this.ctx)
    result.bind()
    result.defineTexture(texture)
    result.unbind
    return result
  }

  rbo (): RenderBufferObject {
    return new RenderBufferObject(this.ctx)
  }

  pbo (): PixelBufferObject {
    return new PixelBufferObject(this.ctx)
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

  vao (drawType: DrawType, type: 'float' | 'short' | 'byte' | 'ushort' | 'ubyte', scheme: Record<string, GLSLTypes>, ...data: Array<number[]>) {
    const gl = this.ctx
    const vaoId = gl.createVertexArray()
    gl.bindVertexArray(vaoId)
    const vbo = this.vbo(drawType, type, scheme)
    vbo.push(...data)
    const vao = new GlVertexArrayObject(gl, vaoId, vbo)
    gl.bindVertexArray(null)
    return vao
  }
  
  createTexture (samplerName: string, surface: SurfaceBase, options?: ITextureOptions) {
    const sampler = this.uniform(samplerName, 'int')
    return this.#textures.addTexture2D(sampler, surface, options ?? { minMag: 'linear' })
  }

  createTextureArray (samplerName: string, surfaces: SurfaceBase[], options?: ITextureOptions) {
    const sampler = this.uniform(samplerName, 'int')
    return this.#textures.addTextureArray(sampler, surfaces, options ?? { minMag: 'linear' })
  }

  createEmptyTexture (size: TSize, samplerName?: string,): GlEmptyTexture {
    const sampler = this.uniform(samplerName ?? 'sampler', 'int')
    
    return this.#textures.addEmptyTexture(sampler, size)
  }

  toBitmap () {
    if (this.canvas instanceof HTMLCanvasElement) {
      throw new Error('AAA')
    }

    return  this.canvas.transferToImageBitmap()
  }

  toSurface (options?: SurfaceGLCreateOptions) {
    return new SurfaceGL(this.canvas.width, this.canvas.height, options, this.canvas as HTMLCanvasElement)
  }

  limits () {
    const i = this.ctx.getParameter(this.ctx.MAX_DRAW_BUFFERS)
    console.log('MAX_DRAW_BUFFERS: ', i)
  }
}