import { removeItem } from "./utils/array"
import { Sprite } from "./sprite"
import { Surface } from "./surface"
import { CollisionHashmap } from "./utils/collision-hashmap"
import { TPoint } from "./point"
import { TRect } from "./rect"

export type GroupOptions = {
  collisionHashmap?: {
    rows: number
    cols: number
    spaceWidth: number
    spaceHeight: number
  }
  useSpriteCollideRect?: boolean
}


export class Group<T extends Sprite>{
  #sprites: T[] = []
  #hashmap: CollisionHashmap<Sprite> | null = null
  #collidedlist: Map<Sprite, Sprite> = new Map()
  readonly useCollisionHashmap: boolean = false
  readonly useSpriteCollideRect: boolean = false

  constructor (options?: GroupOptions) {
    if (options && options.collisionHashmap) {
      const { rows, cols, spaceWidth, spaceHeight } = options.collisionHashmap
      this.#hashmap = new CollisionHashmap<Sprite>(rows, cols, spaceWidth, spaceHeight)
      this.useCollisionHashmap = true
    }

    this.useSpriteCollideRect = Boolean(options && options.useSpriteCollideRect)
  }

  protected update (): void {

  }

  get sprites (): ReadonlyArray<T> {
    return this.#sprites
  }

  add (sprite: T): void {
    if (sprite.rect && (sprite.rect as any).callback) {
      (sprite.rect as any).callback = (sprt: Sprite) => { if (this.#hashmap) this.#hashmap.update(sprt) }
    }
    this.#sprites.push(sprite)
    if (this.#hashmap) this.#hashmap.add(sprite)
  }

  draw (surface: Surface): void {
    this.update()
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

  collidePoint (point: TPoint, callback: (sprite: T) => void): void {
    this.sprites.forEach( sprt => {
      const rect = this.useSpriteCollideRect ? sprt.collideRect : sprt.rect
      if (rect && rect.containsPoint(point)) 
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

  collideGroup (group: Group<T>, callback: (sprite1: Sprite, sprite2: Sprite) => void): void {
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
      if (collide(sprite, sprt, this.useSpriteCollideRect)) {
        if (!this.#collidedlist.get(sprt))
          callback(sprt, sprite)
        this.#collidedlist.set(sprt, sprite)  
        return
      }
      this.#collidedlist.delete(sprt)
    })
  }

  outsideRect (rect: TRect, callback: (sprite: T) => void): void {
    this.sprites.forEach(sprite => { 
      const spriteRect = sprite.rect
      if (!spriteRect) return
      if (!spriteRect.inside(rect))
        callback(sprite)
    })
  }
  
}


function collide(sprite1: Sprite, sprite2: Sprite, useSpriteCollideRect: boolean) {
  const rect1 = useSpriteCollideRect ? sprite1.collideRect : sprite1.rect
  const rect2 = useSpriteCollideRect ? sprite2.collideRect : sprite2.rect
  return sprite1 !== sprite2 && rect1 && rect2 && rect1.overlaps(rect2 as any)
}