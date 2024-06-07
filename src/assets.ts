import { TileMap } from "./tile-map"
import { Rect } from "./rect"
import { Surface } from "./surface"

export async function loadImage (url: string): Promise<Surface> {
  const [img, rect] = await __loadImage(url)
  return Surface.fromImage(img, rect)
}

export async function loadTileMap(tileWidth: number, titleHight: number, url: string): Promise<TileMap> {
  const [img, rect] = await __loadImage(url)
  return TileMap.fromImage(tileWidth, titleHight, img, rect)
}

function __loadImage (url: string): Promise<[HTMLImageElement, Rect]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    const rect = new Rect(0,0,0,0)
    img.onload = () => {
      rect.width = img.naturalWidth
      rect.height = img.naturalHeight
      resolve([img, rect])
    }
    img.onerror = e => reject(e)
  })
}