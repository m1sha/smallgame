/**
 * Internal time setter
 * @internal
 */
const TimeInternal = {
  deltaTime: 0
}

const Time = {
  get deltaTime () { return TimeInternal.deltaTime },
  get time () { return Date.now() / 1000.0 }
}

export { Time, TimeInternal }