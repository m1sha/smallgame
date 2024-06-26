import { TileMap, TileMapInitOptions } from "./tile-map"
import { Rect } from "./rect"
import { Surface } from "./surface"

export async function loadImage (url: string): Promise<Surface> {
  const [img, rect] = await __loadImage(url)
  return Surface.fromImage(img, rect)
}

export async function loadTileMap(tileWidth: number, titleHight: number, url: string, options?: TileMapInitOptions): Promise<TileMap> {
  const [img, rect] = await __loadImage(url)
  return TileMap.fromImage(tileWidth, titleHight, img, rect, options)
}

export async function createTileMap(tileWidth: number, titleHight: number, urls: string[], rows: number, cols: number, options?: TileMapInitOptions): Promise<TileMap> {
  const imageLoader: ReturnType<typeof __loadImage>[] = []
  urls.forEach(p => imageLoader.push(__loadImage(p)))
  const images = (await Promise.all(imageLoader)).map( p => p[0])
  const tileRect = new Rect(0, 0, tileWidth, titleHight)
  const surface = Surface.fromImages(images, tileRect, rows, cols)
  return TileMap.fromImage(tileWidth, titleHight, surface.toImage(), surface.rect, options)
}

function __loadImage (url: string): Promise<[HTMLImageElement, Rect]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    const rect = Rect.zero
    img.onload = () => {
      rect.width = img.naturalWidth
      rect.height = img.naturalHeight
      resolve([img, rect])
    }
    img.onerror = e => reject(e)
  })
}