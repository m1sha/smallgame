import { Time } from "./time"
import { Rect } from "./rect"
import { Surface } from "./surface"
import { Point } from "./point"

export type TParallaxAnimationSettings = {
  directionX: number
  speed: number
}

export class ParallaxLayer {
  readonly surface: Surface

  constructor (
    public readonly name: string, 
    private image: Surface, 
    public readonly rate: number, 
    private viewport: Rect,
    private shift: Point
  ) {
    this.surface = new Surface(viewport.width, viewport.height)
  }

  update () {
    const img = this.image
    const rect = img.rect
    this.surface.clear()
     
    rect.x += this.shift.x * this.rate
      
    this.surface.blit(img, rect)
    if ((0 | rect.x) === (0 | this.viewport.x)) return
      
    if (rect.absWidth < this.viewport.absWidth) {
      const newRect = rect.clone()
      newRect.x = rect.absWidth - 1
      this.surface.blit(img, newRect)
    }

    if (rect.x > this.viewport.x) {
      const newRect = rect.clone()
      newRect.x = this.viewport.x + rect.x - rect.width + 1
      this.surface.blit(img, newRect)
    }

    if (rect.absWidth < this.viewport.x) {
      rect.x = this.viewport.x
    }

    if (rect.x > this.viewport.absWidth) { 
      rect.x = this.viewport.x + rect.x - rect.width
    }
  }
}


export class Parallax {
  private layers: ParallaxLayer[] = []
  private shift: Point
  readonly settings: TParallaxAnimationSettings

  constructor (public readonly viewport: Rect) {
    this.shift = Point.zero
    this.settings = { directionX: 1, speed: 0 }
  }

  addLayer (name: string, surface: Surface, rate: number): void {
    this.layers.push(new ParallaxLayer(name, surface, rate, this.viewport, this.shift))
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
    this.shift.x = this.settings.speed * this.settings.directionX * Time.deltaTime
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