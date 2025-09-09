import { SurfaceBase } from "../../surface/surface-base"
import { Surface } from "../../surface"
import { TextureBase } from "./gl-texture-base"
import { TextureTypes } from "./gl-texture-types"

export class GlTexture extends TextureBase {
  bind (surface: SurfaceBase) {
    const gl = this.gl
    const texture = this.texture
    this.activate()
    gl.bindTexture(this.type, texture)
    const mipmapLevel = this.activateParameters()
    
    if (surface instanceof Surface)
      gl.texImage2D(this.type, mipmapLevel, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface.origin)
    else
      gl.texImage2D(this.type, mipmapLevel, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, (surface as any).origin)

    gl.generateMipmap(this.type)
  }

  update (surface:  SurfaceBase) {
    const gl = this.gl
    const texture = this.texture
    this.activate()
    gl.bindTexture(this.type, texture)
    
    if (surface instanceof Surface)
      gl.texImage2D(this.type, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface.origin)
    else
      gl.texImage2D(this.type, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, (surface as any).origin)

    gl.generateMipmap(this.type)
  }

  protected type: number = TextureTypes.Texture2D
}

