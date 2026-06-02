import { Point } from "../point"

export class StdGamepad {
  private gamepad: Gamepad | null = null

  constructor (private index: number = 0) {
    this.tryGamepadconnected()

    window.addEventListener('gamepadconnected', () => {
      this.tryGamepadconnected()
    })

    //window.addEventListener('gamepaddisconnected', () => this.gamepad = null) 
  }

  get connected () { return Boolean(this.gamepad) }

  private tryGamepadconnected () {
    this.gamepad = navigator.getGamepads()[this.index]
    return this.connected
  }

  get buttonA () { return this.gamepad?.buttons[0].pressed ?? false }
  get buttonB () { return this.gamepad?.buttons[1].pressed ?? false }
  get buttonX () { return this.gamepad?.buttons[2].pressed ?? false }
  get buttonY () { return this.gamepad?.buttons[3].pressed ?? false }

  get buttonBack () { return this.gamepad?.buttons[8].pressed ?? false }
  get buttonStart () { return this.gamepad?.buttons[9].pressed ?? false }

  get buttonLB () {  return this.getButtonState(4) }
  get buttonRB () {  return this.getButtonState(5)  }

  get buttonLT () { return this.gamepad?.buttons[6].value ?? 0 }
  get buttonRT () { return this.gamepad?.buttons[7].value ?? 0 }

  get buttonHome () { return this.gamepad?.buttons[16].pressed ?? 0 }

  get dpadLeft () { return this.gamepad?.buttons[14].pressed ?? false }
  get dpadRight () { return this.gamepad?.buttons[15].pressed ?? false }
  get dpadUp () { return this.gamepad?.buttons[12].pressed ?? false }
  get dpadDown () { return this.gamepad?.buttons[13].pressed ?? false }


  get buttonLS () { return this.gamepad?.buttons[10].pressed ?? 0 }
  get buttonRS () { return this.gamepad?.buttons[11].pressed ?? 0 }

  get leftStick () { return new Point(this.gamepad?.axes[0] ?? 0, this.gamepad?.axes[1] ?? 0)}
  get rightStick () { return new Point(this.gamepad?.axes[2] ?? 0, this.gamepad?.axes[3] ?? 0)}

  private getButtonState (buttonIndex: number) {
    if (!this.tryGamepadconnected()) return false
    debugger
    return this.gamepad?.buttons[buttonIndex].pressed || this.gamepad?.buttons[buttonIndex].touched
  }
}