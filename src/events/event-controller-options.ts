export type TEventControllerOptions = {
  useMultipleInstances: boolean
}

export class EventControllerOptions {
  private static lastTarget: HTMLElement | null = null
  private static instanceCount: number = 0
  private options: TEventControllerOptions

  constructor (options?: TEventControllerOptions) {
    this.options = options ?? { useMultipleInstances: false }
    EventControllerOptions.instanceCount++
  }

  setTarget(htmlContainter: HTMLElement, source: string) {
    EventControllerOptions.lastTarget = htmlContainter
    console.log(source)
  }

  canPressKey (htmlContainter: HTMLElement) {
    if (!this.options.useMultipleInstances) return true
    if (EventControllerOptions.instanceCount === 1) return true
    return EventControllerOptions.lastTarget === htmlContainter
  }
}