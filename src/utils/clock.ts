const millis = () => performance.now()

export class Clock {
  private callback: () => void
  private timeout: number
  private lastTime: number
  private started: boolean
  #deltaTime: number = 0

  constructor (callback: () => void, timeout: number, autostart: boolean = false) {
    this.callback = callback
    this.timeout = timeout
    this.lastTime = millis()
    this.started = autostart
  }

  get deltaTime () { return this.#deltaTime }

  stop (): void { this.started = false }
  start (): void { this.started = true }
  reset (): void { this.lastTime = millis() }

  tick (): void {
    if (!this.started) return

    this.#deltaTime = millis() - this.lastTime

    if (this.#deltaTime > this.timeout) {
      this.reset()
      this.callback()
    }
  }
}

export class Delay {
  private lastTime: number
  #deltaTime: number = 0
  #now: boolean = false

  constructor (public timeout: number) {
    this.lastTime = millis()
  }

  private tick (): void {
    this.#deltaTime = millis() - this.lastTime
    this.#now = false
    if (this.#deltaTime > this.timeout) {
      this.reset()
      this.#now = true
    }
  }

  get ready() {
    this.tick()
    return this.#now
  }

  reset (): void { this.lastTime = millis() }
}

export { millis }
