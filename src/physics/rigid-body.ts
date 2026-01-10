import { Point, TPoint } from "../point"
import { Time } from "../time"

export class RigidBody2D {
  angle: number = 0
  angularVelocity: number = 0
  inertia: number
  angularDrag: number
  angularSpeed: number = 1

  mass: number = 1
  velocity = Point.zero

  constructor (inertia: number = 1, angularDrag: number = 0.1) {
    this.inertia = inertia
    this.angularDrag = angularDrag
  }

  addTorque (torque: number) {
    this.angularVelocity += (torque / this.inertia) * Time.deltaTime
  }

  addForce (force: TPoint, type: 'force' | 'impulse') {
    const dt = Time.deltaTime
    const acceleration = new Point(force.x / this.mass, force.y / this.mass)
    this.velocity.shiftSelf(type === 'impulse' ? acceleration : acceleration.scaleSelf(dt))
  }

  update () {
    this.angularVelocity *= (1 - this.angularDrag * Time.deltaTime * this.angularSpeed)
    this.angle += this.angularVelocity * Time.deltaTime * this.angularSpeed
    this.angle %= 360
    //this.angle = ((this.angle + Math.PI) % (2 * Math.PI)) - Math.PI
  }
}
