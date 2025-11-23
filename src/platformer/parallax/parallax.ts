import { Rect } from "../../rect"
import { Surface } from "../../surface"
import { Point } from "../../point"
import { ParallaxLayer } from "./parallax-layer"


export class Parallax {
  private layers: ParallaxLayer[] = []
  readonly pos: Point

  constructor (public readonly viewport: Rect) {
    this.pos = Point.zero
  }

  addLayer (name: string, surface: Surface, rate: number): void {
    this.layers.push(new ParallaxLayer(name, surface, rate, this.viewport, this.pos))
  }

  clearLayers () {
    this.layers = []
  }

  getLayer (index: number): Readonly<ParallaxLayer> | null
  getLayer (name: string): Readonly<ParallaxLayer> | null
  getLayer (...args: Array<any>): Readonly<ParallaxLayer> | null {
    if (args.length === 1 && typeof args[0] === 'number') {
      return this.layers[args[0]]
    }
    
    if (args.length === 1 && typeof args[0] === 'string') {
      return this.layers.find(p => p.name === args[0]) ?? null
    }

    throw new Error('Unsupported arguments.')
  }

  protected update (): void {
    for (const layer of this.layers) {
      layer.update()
    }
  }

  draw (screen: Surface, insertSuface?: Surface, insertIndex?: number): void {
    for (let i = 0; i < this.layers.length; i++) {
      const surface = this.layers[i].surface
      screen.blit(surface, screen.rect)
      
      if (insertSuface && insertIndex === i) {
        screen.blit(insertSuface, screen.rect)
      }
    }

    this.update()
  }

  get layerNames () { return this.layers.map(p => p.name) }
  get layerCount () { return this.layers.length }
}