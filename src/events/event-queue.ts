export interface EventQueue {
  push(e: Event): void
  pop(e: Event): void
}  