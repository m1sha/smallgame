import { Rect } from "./rect"
import { ISurface } from "./interfaces"
import { FragmnetShader, GlProgram, VertexShader } from "./gl"

export type SurfaceGLCreateOptions = {
  useAlpha?: boolean
  useSmooth?: boolean
  useOffscreen?: boolean
}

export class SurfaceGL implements ISurface {
  protected canvas: HTMLCanvasElement | OffscreenCanvas
  protected ctx: WebGL2RenderingContext 
  protected program: GlProgram
  #rect: Rect

  constructor(width: number, height: number, options?: SurfaceGLCreateOptions, canvas?: HTMLCanvasElement) {
    this.canvas = canvas ? canvas : options && options.useOffscreen ? new OffscreenCanvas(width, height) : document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.#rect = new Rect(0, 0, width, height)
    this.ctx = this.canvas.getContext('webgl2')!
    
    const ver = new VertexShader(this.ctx, /*glsl*/`
      in  vec2 a_Position;
      in  vec2 a_TexCoord;
      out vec2 v_TexCoord;

      void main()
      {
        gl_Position = vec4(a_Position, 0.0, 1.0);
        v_TexCoord = a_TexCoord;
      }
    `)

    const frg = new FragmnetShader(this.ctx, /*glsl*/`
      uniform sampler2D u_sampler2D;
      uniform vec2 iResolution;
      in  vec2 v_TexCoord;
      out vec4 fragColor;

      void main() {
        fragColor = texture(u_sampler2D, v_TexCoord);
      }
    `)

    this.program = new GlProgram(this.ctx, ver, frg)
    this.program.create()
  }

  get rect () { return this.#rect }

  get width () { return this.#rect.width }

  get height () { return this.#rect.height }
}