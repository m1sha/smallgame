import { Surface } from "../../surface"
import { TextureBase } from "./gl-texture-base"
import { TextureTypes } from "./gl-texture-types"
import { SurfaceBase } from "../../surface/surface-base"

export class GlTextureArray extends TextureBase {
  protected type: number = TextureTypes.Texture2DArray

  bind (surfaces: SurfaceBase[]) {
    const gl = this.gl
    const texture = this.texture
    this.activate()
    gl.bindTexture(this.type, texture)

    gl.texStorage3D(this.type, 2,  gl.RGBA8, surfaces[0].width, surfaces[0].height, 2)
    const mipmapLevel = this.activateParameters()

    for (let i = 0; i < surfaces.length; i++) {
      const surface = surfaces[i]
      
      if (surface instanceof Surface)
        //gl.texImage3D(this.type, i, gl.RGBA8, surface.width, surface.height, 0, 0, gl.UNSIGNED_BYTE, gl.RGBA, surface.draw.origin.canvas)
        gl.texSubImage3D(this.type, 0,0,0, i, surface.width, surface.height, 1, gl.RGBA, gl.UNSIGNED_BYTE, surface.draw.origin.canvas)
      else
        gl.texImage3D(this.type, 0, gl.RGBA8, surface.width, surface.height, i, 0, gl.UNSIGNED_BYTE, gl.RGBA, (surface as any).origin)
    }

    //gl.generateMipmap(this.type)
  }

}
