import { Color } from "../color"

export type RGBA = [number, number, number, number]
type ColorChannel = 'r' | 'g' | 'b' | 'a'

export class Pixel {
  #color: Color

  constructor (readonly x: number, readonly y: number, private pixels: Pixels) {
    const index = this.getIndex(x, y)
    const r = pixels.imageData.data[index] / 255
    const g = pixels.imageData.data[index + 1] / 255
    const b = pixels.imageData.data[index + 2] / 255
    const a = pixels.imageData.data[index + 3] / 255
    this.#color = new Color(r, g, b, a)  
  }

  get color () {
    return this.#color
  }

  set color (color: Color) {
    this.#color = color
    const index = this.getIndex(this.x, this.y)
    this.pixels.imageData.data[index] = this.color.ri
    this.pixels.imageData.data[index + 1] = this.color.gi
    this.pixels.imageData.data[index + 2] = this.color.bi
    this.pixels.imageData.data[index + 3] = 255
  }

  get rgba () {
    return this.pixels.int32(this.x, this.y)
  }

  
  inRadius (pixel: Pixel, radius: number) {
    return (
      Math.abs(this.color.r - pixel.color.r) <= radius && 
      Math.abs(this.color.g - pixel.color.g) <= radius && 
      Math.abs(this.color.b - pixel.color.b) <= radius 
    )
  }

  private getIndex (x: number, y: number) {
    return this.pixels.imageData.width * y * 4 + x * 4
  }
  
}

export class Pixels {
  imageData: ImageData

  constructor (imageData: ImageData) {
    this.imageData = imageData
  }

  getPixel (x: number, y: number): Pixel {
    return new Pixel(x, y, this)
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

  forEach (callback: (pixel: Pixel) => void) {
    for (let i = 0; i < this.height; i++)
      for (let j = 0; j < this.width; j++)
        callback(new Pixel(j, i, this))
  }

  map<T> (callback: (pixel: Pixel) => T): T[] {
    const result = []
    for (let i = 0; i < this.height; i++)
      for (let j = 0; j < this.width; j++)
        result.push(callback(new Pixel(j, i, this)))
    return result
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
