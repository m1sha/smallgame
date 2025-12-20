//import { removeItem } from "./utils/array"
import { unsafecast, removeItem } from "../utils"
import { Sprite } from "./sprite"
import { Entity } from "../entity"
import { SurfaceBase } from "../surface"
import { CollisionHashmap } from "../utils/collision-hashmap"
import { type TPoint } from "../point"
import { Rect, type TRect } from "../rect"


export type GroupOptions = {
  collisionHashmap?: {
    rows: number
    cols: number
    spaceWidth: number
    spaceHeight: number
  }
  useSpriteCollideRect?: boolean
}

export type CollideOptions = {
  once?: boolean
  reverseEnum?: boolean
}


export class Group<T extends Entity>{
  #sprites: T[] = []
  #hashmap: CollisionHashmap<Entity> | null = null
  #collidedlist: Map<Entity, Entity> = new Map()
  readonly useCollisionHashmap: boolean = false
  readonly useSpriteCollideRect: boolean = false

  constructor (options?: GroupOptions) {
    if (options && options.collisionHashmap) {
      const { rows, cols, spaceWidth, spaceHeight } = options.collisionHashmap
      this.#hashmap = new CollisionHashmap<Entity>(rows, cols, spaceWidth, spaceHeight)
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
      (sprite.rect as any).callback = (sprt: Entity) => { if (this.#hashmap) this.#hashmap.update(sprt) }
    }
    this.#sprites.push(sprite)
    if (this.#hashmap) this.#hashmap.add(sprite)
  }

  draw (surface: { blit: (image: SurfaceBase, rect: Rect) => void }): void {
    this.update()
    for (const sprite of this.#sprites) {
      if (sprite instanceof Sprite) sprite.draw(surface)
    }
  }

  compute (): void {
    this.update()
    for (const sprite of this.#sprites) {
      unsafecast<{ update: () => void}>(sprite).update?.()
    }
  }

  has (sprite: Entity): boolean {
    return this.#sprites.some(p => p === sprite)
  }

  remove (sprite: Entity): void {
    removeItem(this.#sprites, p => p === sprite)
  }

  removeAll () {
    while(this.#sprites.pop());
  }

  find (predicate: (sprite: T) => boolean) {
    return this.sprites.find(predicate)
  }

  collide (predicate: (sprite: T) => boolean, callback: (sprite: T, index: number) => void, options?: CollideOptions): boolean {
    let result = false

    const iter = (i: number) => {
      const sprt = this.sprites[i]
      if (!predicate(sprt)) return 0
      
      callback(sprt, i)
      if (options && options.once) return -1
      return 1
    }

    if (options && options.reverseEnum) {
      for (let i = this.sprites.length -1; i>= 0; i--) {
        const r = iter(i)
        if (r < 0) break
        if (r > 0) result = true
      }
    } else {
      for (let i = 0; i < this.sprites.length; i++) {
        const r = iter(i)
        if (r < 0) break
        if (r > 0) result = true
      }
    }

    return result
  }

  collidePoint (point: TPoint, callback: (sprite: T, index: number) => void, options?: CollideOptions): boolean {
    let result = false

    const iter = (i: number) => {
      const sprt = this.sprites[i]
      const rect = this.useSpriteCollideRect ? sprt.collideRect : sprt.rect
      
      if (!rect || !rect.containsPoint(point)) return 0
      
      callback(sprt, i)
      if (options && options.once) return -1
      return 1
    }

    if (options && options.reverseEnum) {
      for (let i = this.sprites.length -1; i>= 0; i--) {
        const r = iter(i)
        if (r < 0) break
        if (r > 0) result = true
      }
    } else {
      for (let i = 0; i < this.sprites.length; i++) {
        const r = iter(i)
        if (r < 0) break
        if (r > 0) result = true
      }
    }

    return result
  }

  collideSprite<R extends Entity> (sprite: R, callback: (sprite: T) => void): void {
    if (this.#hashmap && this.useCollisionHashmap) {
      const sprites = this.#hashmap.getCompanions(sprite)
      this.collideSprites(sprite, sprites, spr => callback(spr as T))  
      return
    }

    this.collideSprites(sprite, this.#sprites, spr => callback(spr as T))
  }

  collideGroup<R extends Entity> (group: Group<R>, callback: (sprite1: T, sprite2: R) => void): void {
    if (this.#hashmap && this.useCollisionHashmap) {
      for (const sprite2 of group.#sprites) {
        const sprites = this.#hashmap.getCompanions(sprite2)
        this.collideSprites(sprite2, sprites, spr => callback(spr as T, sprite2)) 
      }
      return
    }

    for (const sprite2 of group.#sprites) {
      this.collideSprites(sprite2, this.#sprites, spr => callback(spr as T, sprite2)) 
    }
  }

  collideSprites(sprite: Entity, sprites: Entity[], callback: (sprite1: Entity, sprite2: Entity) => void) {
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


function collide(sprite1: Entity, sprite2: Entity, useSpriteCollideRect: boolean) {
  const rect1 = useSpriteCollideRect ? sprite1.collideRect : sprite1.rect
  const rect2 = useSpriteCollideRect ? sprite2.collideRect : sprite2.rect
  return sprite1 !== sprite2 && rect1 && rect2 && rect1.overlaps(rect2 as any)
}