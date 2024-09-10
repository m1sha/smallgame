import { Surface } from "./surface"
import { Drawable } from "./drawable"
import { TPoint } from "./point"
import { TTextStyle, TextStyle } from "./styles/text-style"

export class Text implements Drawable {
  content: string
  pos: TPoint
  style: TextStyle

  constructor (content: string, pos: TPoint, style: TTextStyle | TextStyle) {
    this.content = content
    this.pos = pos
    this.style = style instanceof TextStyle ? style : new TextStyle(style)
  }
  
  draw (suface: Surface): void {
    assignTextStyle(suface.draw as any, this.style)
    drawText(suface.draw as any, this.style, this.content, this.pos.x, this.pos.y)
  }
}


function assignTextStyle (ctx: CanvasRenderingContext2D, style: TextStyle) {
  style = style || {}
  ctx.fillStyle = style.color
  ctx.strokeStyle = style.outlineColor
  if (style.outlineWidth) ctx.lineWidth = style.outlineWidth
  const fontName = style.fontName || 'serif'
  const fontSize = style.fontSize || '10pt'
  const bold = typeof style.bold === 'boolean' && style.bold ? 'bold ' : style.bold ? style.bold : 'normal'
  const italic = style.italic ? 'italic ' : 'normal'
  const fontVariant = style.fontVariant ?? 'normal'
  ctx.font = `${italic} ${bold} ${fontVariant} ${fontSize} ${fontName}`
}

function drawText (ctx: CanvasRenderingContext2D, style: TextStyle, text: string, x: number, y: number) {
  if (style.paintOrder === 'stroke') {
    strokeText(ctx, style, text, x, y)
    fillText(ctx, style, text, x, y)
  }

  if (!style.paintOrder || style.paintOrder === 'fill') {
    fillText(ctx, style, text, x, y)
    strokeText(ctx, style, text, x, y)
  }
}

function fillText (ctx: CanvasRenderingContext2D, style: TextStyle, text: string, x: number, y: number) {
  if (style.color !== 'transparent') ctx.fillText(text, x, y)
}

function strokeText (ctx: CanvasRenderingContext2D, style: TextStyle, text: string, x: number, y: number) {
  if (style.outlineColor && style.outlineColor !== 'transparent') ctx.strokeText(text, x, y)
}
