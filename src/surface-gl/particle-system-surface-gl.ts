import { SurfaceGLBase } from "./surface-gl-base"
import defaultVerSource from './shaders/particle-system/vert'
import defaultFragSource from './shaders/particle-system/frag'

export default class ParticleSystemSurfaceGl extends SurfaceGLBase {
  create (): void {
    super.create()
  }

  protected get defaultVerSource () { return defaultVerSource }
  protected get defaultFragSource () { return defaultFragSource }
}