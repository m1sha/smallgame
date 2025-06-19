import { type PaintOrder } from "./paint-order"

export type FontWeight = 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
export type FontVariant = 'normal' | 'small-caps'
export interface TTextStyle {
  color?: string
  outlineColor?: string
  outlineWidth?: number
  fontName?: string
  fontSize?: string
  bold? : boolean | FontWeight
  italic?: boolean
  fontVariant?: FontVariant
  paintOrder?: PaintOrder
  // readonly shadow?: Shadow
}

export class TextStyle {
  color: string
  outlineColor: string
  outlineWidth: number
  fontName: string
  fontSize: string
  bold : boolean | FontWeight
  italic: boolean
  fontVariant: FontVariant
  paintOrder: PaintOrder
  // #shadow?: Shadow

  constructor (style: TTextStyle) {
    
    this.color = style.color ? style.color : '#212121'
    this.outlineColor = style.outlineColor ? style.outlineColor : 'transparent'
    this.outlineWidth = style.outlineWidth ? style.outlineWidth : 1
    this.fontName = style.fontName ? style.fontName : 'serif'
    this.fontSize = style.fontSize ? style.fontSize : '12px'
    this.bold = style.bold ? style.bold : 'normal'
    this.italic = style.italic ? style.italic : false
    this.fontVariant = style.fontVariant ? style.fontVariant : 'normal'
    this.paintOrder = style.paintOrder ? style.paintOrder : 'fill'
    //this.#shadow = style.shadow
    
  }
}