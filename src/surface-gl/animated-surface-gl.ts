import { SurfaceGLBase } from "./surface-gl-base";

export class AnimatedSurfaceGl extends SurfaceGLBase {
  draw () {}
  protected get defaultVerSource(): string {
    throw new Error("Method not implemented.");
  }
  protected get defaultFragSource(): string {
    throw new Error("Method not implemented.");
  }
}