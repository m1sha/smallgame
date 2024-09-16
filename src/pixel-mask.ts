import { Surface } from "./surface"

export class PixelMask {
  data: Uint8Array
  width: number
  height: number

  constructor (width: number, height: number, data?: Uint8Array) {
    this.width = width
    this.height = height
    this.data = data ? data : new Uint8Array(width * height)
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
    const surface = new Surface(this.width, this.height, false)
    surface.draw.origin.drawImage(img, 0, 0)
    return surface
  }

  static fromImageData(image: ImageData) {
    const data = new Uint8Array(image.width * image.height)
    let j = 0
    for (let i = 0; i < image.data.length; i+=4) {
      const trans = image.data[i+3] === 0
      data[j++] = trans ? 0 : 1
    }

    return new PixelMask(image.width, image.height, data)
  }
}