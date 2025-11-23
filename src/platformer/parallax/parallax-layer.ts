// import { Sketch } from "../../sketch"
import { Point } from "../../point"
import { Rect } from "../../rect"
import { Surface } from "../../surface"

export class ParallaxLayer {
  readonly surface: Surface

  constructor (
    public readonly name: string, 
    private image: Surface, 
    public readonly rate: number, 
    private viewport: Rect,
    private pos: Point
  ) {
    this.surface = new Surface(viewport.width, viewport.height)
  }

  update () {
    const img = this.image
    const rect = img.rect
    this.surface.clear()
    
    const r1 = rect.clone()
    const r2 = rect.clone()
    const r3 = rect.clone()

    const x = this.pos.x * this.rate % rect.width

    r1.x = x - rect.width + 1
    r2.x = x
    r3.x = x + rect.width - 1
   
    this.surface.blit(img, r1)
    this.surface.blit(img, r2)
    this.surface.blit(img, r3)

    // new Sketch()
    // .rect({ stroke: '#881111', fill: '#8811114d'}, r1)
    // .rect({ stroke: '#118835ff', fill: '#1188354d'}, r2)
    // .rect({ stroke: '#111d88ff', fill: '#111d884d'}, r3)
    // .draw(this.surface)
  }
}