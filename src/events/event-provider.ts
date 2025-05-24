import { Keys } from "keys/keys"
import { GameEvents } from "./game-event"

export interface IEventProvider {
  readonly event: GameEvents
  readonly key: Keys
}