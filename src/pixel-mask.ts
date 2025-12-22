import { Rect } from "./rect"
import { Surface } from "./surface"

export class PixelMask {
  readonly data: Uint8Array
  readonly width: number
  readonly height: number

  constructor (private surface: { rect: Rect }, width: number, height: number, data?: Uint8Array) {
    this.width = width
    this.height = height
    this.data = data ? data : new Uint8Array(width * height)
  }

  overlaps (mask: PixelMask, overlapRect?: Rect): boolean {
    let rect: Rect | null = overlapRect ?? null
    if (!rect) rect = this.surface.rect.getOverlapRect(mask.surface.rect)
    if (!rect) return false
    
    const offsetA = rect.shift(this.surface.rect.topLeft.neg())
    const offsetB = rect.shift(mask.surface.rect.topLeft.neg())
    const w = 0 | rect.width
    const h = 0 | rect.height

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        if (j + offsetB.x > mask.width) continue
        if (i + offsetB.y > mask.height) return false
        if (j + offsetA.x > this.width) continue
        if (i + offsetA.y > this.height) return false
        
        const vo = mask.getPixel(j + offsetB.x, i + offsetB.y)
        const vt = this.getPixel(j + offsetA.x, i + offsetA.y)

        if (vo === 1 && vt === 1) return true
      }
    }
    return false
  }

  async toSurface () {
    const imageData = new ImageData(this.width, this.height)
    let j = 0
    for (let i = 0; i < imageData.data.length; i+=4) {
      const bwValue = !this.data[j++] ? 0 : 255
      imageData.data[i] = bwValue
      imageData.data[i + 1] = bwValue
      imageData.data[i + 2] = bwValue
      imageData.data[i + 3] = bwValue
    }
    const img = await createImageBitmap(imageData)
    const surface = new Surface(this.width, this.height, { useSmooth: false })
    surface.draw.origin.drawImage(img, 0, 0)
    return surface
  }

  static fromImageData(surface: { rect: Rect }, image: ImageData) {
    const data = new Uint8Array(image.width * image.height)
    let j = 0
    for (let i = 0; i < image.data.length; i+=4) {
      const solid = image.data[i+3] > 0
      data[j++] = solid ? 1 : 0
    }

    return new PixelMask(surface, image.width, image.height, data)
  }

  private getPixel (x: number, y: number) {
    const index = (0 | this.width) * (0 | y) + (0 | x)
    return this.data[index]
  }
}