import { TPoint } from "../point"
import { TTextStyle } from "../styles/text-style"
import { TRect } from "../rect"

export type Text = {
  style: TTextStyle
  type: 'text'
  text: string
  pos: TPoint | TRect
  target: string
}