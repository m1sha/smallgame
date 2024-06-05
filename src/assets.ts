import { Rect } from "./rect"
import { Surface } from "./surface"

export class Assets {
  async loadImage (url: string): Promise<Surface> {
    const [img, rect] = await loadImage(url)
    return Surface.fromImage(img, rect)
  }
}

function loadImage (url: string): Promise<[HTMLImageElement, Rect]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    const rect = new Rect(0,0,0,0)
    img.onload = ev => {
      rect.width = img.naturalWidth
      rect.height = img.naturalHeight
      resolve([img, rect])
    }
    img.onerror = e => reject(e)
  })
  
}