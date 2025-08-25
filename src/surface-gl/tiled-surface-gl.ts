import { vec2 } from "../gl"
import { SurfaceGLBase } from "./surface-gl-base"
import defaultVerSource from './shaders/tiled/vert'
import defaultFragSource from './shaders/tiled/frag'
import { Surface } from "../surface/surface"
import { GlTexture } from "../gl/textures/gl-texture"

export class TiledSurfaceGl extends SurfaceGLBase {
  private vertexCount: number = 0
  private tex: GlTexture | null = null

  create () {
    super.create()

    const texTransform = this.context.uniform('uTexTransform', 'mat4')
    texTransform.set(new DOMMatrix().flipY().scale(64 / this.width, 64 / this.width))
    this.tex = this.context.createTexture('uSampler', Surface.default, { minMag: this.imageRendering === 'auto' ? 'linear': 'nearest' })

    this.vertexCount = this.context
      .vbo('static', 'float', { a_Position: vec2 })
      .push([0, 0,  -0.25, 0.45, 0.25, 0.45])
  }

  protected get defaultVerSource () { return defaultVerSource }
  protected get defaultFragSource () { return defaultFragSource }

  addTilemaps (surfaces: Surface[]) {
    if (this.tex) this.tex.update(surfaces[0])
  }

  drawTiles () {
    this.context.drawArrays('points', this.vertexCount)
  }
}