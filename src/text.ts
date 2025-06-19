import { Surface } from "./surface"
import { Drawable } from "./drawable"
import { type TPoint } from "./point"
import { type TTextStyle, TextStyle } from "./styles/text-style"
import { type Pivote } from "./pivote"

export type TextPosition = TPoint & { pivote?: Pivote }

export class Text implements Drawable {
  content: string
  #pos: TextPosition
  style: TextStyle
  #mitrics: { width: number, height: number }

  constructor (content: string, pos: TextPosition, style: TTextStyle | TextStyle) {
    this.content = content
    this.#pos = pos
    this.style = style instanceof TextStyle ? style : new TextStyle(style)
    this.#mitrics = TextMeasurer.measureText(content, this.style)
  }
  
  draw (suface: Surface): void {
    assignTextStyle(suface.draw as any, this.style)

    const x = this.#pos.x
    const y = this.#pos.y + this.#mitrics.height

    drawText(suface.draw as any, this.style, this.content, x, y)
  }

  get pos (): Readonly<TextPosition> {
    return this.#pos
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

export class TextMeasurer {
  private static defaultCanvas = document.createElement('canvas')
  private static defaultCtx = this.defaultCanvas.getContext('2d')!

  static measureText (text: string, style: TextStyle): { width: number, height: number } {
    const ctx = TextMeasurer.defaultCtx
    const metrics =this.measureTextInt(ctx, text, style)
    return {
      width: metrics.width,
      height: this.getHeight(text, style, metrics)
    }
  }

  private static measureTextInt (ctx: CanvasRenderingContext2D, text: string, style: TextStyle) {
    ctx.save()
    this.assignTextStyle(ctx, style)
    const result = ctx.measureText(text)
    ctx.restore()
    return result
  }

  private static assignTextStyle (ctx: CanvasRenderingContext2D, style: TextStyle) {
    style = style || {}
    ctx.fillStyle = style.color 
    const fontName = style.fontName || 'serif'
    const fontSize = style.fontSize || '10pt'
    const bold = typeof style.bold === 'boolean' && style.bold ? 'bold ' : style.bold ? style.bold : 'normal'
    const italic = style.italic ? 'italic ' : 'normal'
    const fontVariant = style.fontVariant ?? 'normal'
    ctx.font = `${italic} ${bold} ${fontVariant} ${fontSize} ${fontName}`
  }

  private static getWidth (text: string, style: TextStyle): number {
    const ctx = TextMeasurer.defaultCtx
    return this.measureTextInt(ctx, text, style).width
  }

  private static getHeight (_: string, style: TextStyle, metrics: TextMetrics) {
    if (metrics.actualBoundingBoxAscent && metrics.actualBoundingBoxDescent) {
      return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent 
    }
    return TextMeasurer.getWidth('M', style) 
  }
}

