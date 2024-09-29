import { Clock } from "../utils"
import { TileMap } from "../tile-map"
import { Surface } from "../surface"

export interface IAnimation {
  get image (): Surface
  play (): void
  pause (): void
  stop (): void
  tick (): void
}

export class Animation implements IAnimation {
  #clock: Clock
  #frame: number
  readonly map: TileMap
  readonly rate: number

  constructor (map: TileMap, rate: number) {
    this.map = map
    this.rate = rate
    this.#frame = 0
    this.#clock = new Clock(() => this.next(), 1000 / this.rate)
  }

  get image () {
    return this.map.cell(this.#frame)
  }

  play () {
    this.#clock.start()
  }

  pause () {
    this.#clock.stop()
  }

  stop () {
    this.#frame = 0
    this.#clock.stop()
  }

  tick () {
    this.#clock.tick()
  }

  private next () {
    this.#frame++
    if (this.#frame >= this.map.count) this.#frame = 0
  }
}