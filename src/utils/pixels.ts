export type RGBA = [number, number, number, number]
type ColorChannel = 'r' | 'g' | 'b' | 'a'

export class Pixels {
  imageData: ImageData

  constructor (imageData: ImageData) {
    this.imageData = imageData
  }

  getPixel (x: number, y: number): RGBA {
    const index = this.getIndex(x, y)
    return [
      this.imageData.data[index],
      this.imageData.data[index + 1],
      this.imageData.data[index + 2],
      this.imageData.data[index + 3]
    ]
  }

  setPixel (x: number, y: number, color: RGBA) {
    const index = this.getIndex(x, y)
    this.imageData.data[index] = color[0]
    this.imageData.data[index + 1] = color[1]
    this.imageData.data[index + 2] = color[2]
    this.imageData.data[index + 3] = color[3]
  }

  getValue (x: number, y: number, _: ColorChannel): number {
    const index = this.getIndex(x, y)
    return this.imageData.data[index]
  }

  setValue (x: number, y: number, color: ColorChannel, value: number) {
    const index = this.getIndex(x, y) + this.getColorIndex(color)
    this.imageData.data[index] = value
  }

  int32 (x: number, y: number): number {
    const index = this.getIndex(x, y)
    return this.imageData.data[index + 3] << 24 | this.imageData.data[index + 1] << 16  | this.imageData.data[index + 2] << 8 | this.imageData.data[index + 3]
  }

  get width () {
    return this.imageData.width
  }

  get height () {
    return this.imageData.height
  }

  private getIndex (x: number, y: number) {
    return this.imageData.width * y * 4 + x * 4
  }

  private getColorIndex (color: ColorChannel) {
    switch (color) {
      case 'r': return 0
      case 'g': return 1
      case 'b': return 2
      case 'a': return 3
    }
  }

  static get emptyPixel (): RGBA {
    return [255, 255, 255, 255]
  }
}
