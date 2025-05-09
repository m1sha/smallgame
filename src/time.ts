import { FPSCounter, millis } from "./utils"

/**
 * Internal time setter
 * @internal
 */
const InternalTimeSetter = {
  deltaTime: 0
}

const Time = {
  get deltaTime () { return InternalTimeSetter.deltaTime },
  get time () { return millis() * 0.001 },
  get fps () { return FPSCounter.get() }
}

export { Time, InternalTimeSetter }