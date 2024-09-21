/**
 * Internal time setter
 * @internal
 */
const InternalTimeSetter = {
  deltaTime: 0
}

const Time = {
  get deltaTime () { return InternalTimeSetter.deltaTime },
  get time () { return Date.now() / 1000.0 }
}

export { Time, InternalTimeSetter }