export type ResourceLoaderCallBackFactory<T> = (url: string, callback: () => void, onerror: (ev: string | Event) => void) => T
export abstract class ResourceLoader<T> {
  #items: Record<string, T> = {}
  #loadedList: Record<number, boolean> = {}
  #resolve: null | (() => null) = null
  #reject: null | ((reason?: any) => void) = null
  #factory = this.factory()

  onLoading?: (count: number) => void
  onLoad?: () => void

  add (name: string, url: string) {
    const counter = this.count + 1
    this.#loadedList[counter] = false
    this.#items[name] = this.#factory(url, () => {
      this.#loadedList[counter] = true
      this.#checkFinish()
    }, e => this.#reject && this.#reject(e))
  }

  abstract factory(): ResourceLoaderCallBackFactory<T>

  get (name: string) {
    return this.#items[name]
  }

  get names () {
    return Object.keys(this.#items)
  }

  get count () {
    return this.names.length
  }

  get busy (): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#resolve = (resolve as unknown) as (() => null)
      this.#reject = reject
      if (this.#allLoaded()) resolve()
    })
  }

  #checkFinish () {
    if (this.#allLoaded() && this.#resolve) {
      this.#resolve()
      if (this.onLoad) this.onLoad()
      return
    }
    if (this.onLoading) this.onLoading(this.loadedCount)
  }

  #allLoaded () {
    return !Object.values(this.#loadedList).some(p => !p)
  }

  get loadedCount (): number {
    return Object.values(this.#loadedList).filter(p => p).length
  }
}
