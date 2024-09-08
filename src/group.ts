import { removeItem } from "./utils/array"
import { Sprite } from "./sprite"
import { Surface } from "./surface"
import { CollisionHashmap } from "./utils/collision-hashmap"
import { TPoint } from "./point"


export class Group {
  #sprites: Sprite[] = []
  #hashmap: CollisionHashmap<Sprite> | null = null
  #collidedlist: Map<Sprite, Sprite> = new Map()
  readonly useCollisionHashmap: boolean = false

  constructor (options?: { useCollisionHashmap: boolean, hashmapRows: number, hashmapCols: number, spaceWidth: number, spaceHeight: number  }) {
    if (options && options.useCollisionHashmap) {
      this.#hashmap = new CollisionHashmap<Sprite>(options.hashmapRows, options.hashmapCols, options.spaceWidth, options.spaceHeight)
      this.useCollisionHashmap = true
    }
  }

  get sprites (): ReadonlyArray<Sprite> {
    return this.#sprites
  }

  add (sprite: Sprite): void {
    if (sprite.rect && (sprite.rect as any).callback) {
      (sprite.rect as any).callback = (sprt: Sprite) => { if (this.#hashmap) this.#hashmap.update(sprt) }
    }
    this.#sprites.push(sprite)
    if (this.#hashmap) this.#hashmap.add(sprite)
  }

  draw (surface: Surface): void {
    for (const sprite of this.#sprites) {
      sprite.draw(surface)
    }
  }

  has (sprite: Sprite): boolean {
    return this.#sprites.some(p => p === sprite)
  }

  remove (sprite: Sprite): void {
    removeItem(this.#sprites, p => p === sprite)
  }

  collidePoint (point: TPoint, callback: (sprite: Sprite) => void): void {
    this.sprites.forEach( sprt => {
      if (sprt.rect && sprt.rect.containsPoint(point)) 
        callback(sprt)
    })
  }

  collideSprite (sprite: Sprite, callback: (sprite: Sprite) => void): void {
    if (this.#hashmap && this.useCollisionHashmap) {
      const sprites = this.#hashmap.getCompanions(sprite)
      this.collideSprites(sprite, sprites, spr => callback(spr))  
      return
    }

    this.collideSprites(sprite, this.#sprites, spr => callback(spr))
  }

  collideGroup (group: Group, callback: (sprite1: Sprite, sprite2: Sprite) => void): void {
    if (this.#hashmap && this.useCollisionHashmap) {
      for (const sprite2 of group.#sprites) {
        const sprites = this.#hashmap.getCompanions(sprite2)
        this.collideSprites(sprite2, sprites, spr => callback(spr, sprite2)) 
      }
      return
    }

    for (const sprite2 of group.#sprites) {
      this.collideSprites(sprite2, this.#sprites, spr => callback(spr, sprite2)) 
    }
  }

  collideSprites(sprite: Sprite, sprites: Sprite[], callback: (sprite1: Sprite, sprite2: Sprite) => void) {
    sprites.forEach( sprt => {
      if (collide(sprite, sprt)) {
        if (!this.#collidedlist.get(sprt))
          callback(sprt, sprite)
        this.#collidedlist.set(sprt, sprite)  
        return
      }
      this.#collidedlist.delete(sprt)
    })
  }
  
}


function collide(sprite1: Sprite, sprite2: Sprite) {
  return sprite1 !== sprite2 && sprite1.rect && sprite2.rect && sprite1.rect.overlaps(sprite2.rect as any)
}