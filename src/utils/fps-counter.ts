import { Time } from "../time"

const FPSCounter = {
  values: [] as number[],
  update () {
    this.values.push(1 / Time.deltaTime)
    if (this.values.length > 100)
      this.values.shift()
  },
  get () {
    let count = 0
    this.values.forEach(p=> (count += p))
    return count / this.values.length
  }
}

export { FPSCounter }
