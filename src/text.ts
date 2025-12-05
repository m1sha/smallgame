import { Surface } from "./surface"
import { Drawable } from "./drawable"
import { setPoint, type TPoint } from "./point"
import { type TTextStyle, TextStyle } from "./styles/text-style"
import { TSize } from "./size"
import { Rect, TRect } from "./rect"

export class Text implements Drawable {
  content: string
  #pos: TPoint
  style: TextStyle
  #mitrics: { width: number, height: number }

  constructor (content: string, style: TTextStyle | TextStyle) {
    this.content = content
    this.#pos = setPoint(0, 0)
    this.style = style instanceof TextStyle ? style : new TextStyle(style)
    this.#mitrics = TextMeasurer.measureText(content, this.style)
  }
  
  draw (suface: Surface): void {
    assignTextStyle(suface.draw as any, this.style)
    const y = this.#pos.y + this.#mitrics.height + this.style.outlineWidth
    drawText(suface.draw as any, this.style, this.content, this.#pos.x, y)
  }

  get pos () {
    return this.#pos
  }

  set pos (value: TPoint) {
    if (!value) throw new Error('Text.pos: the value is null.')
    this.#pos.x = value.x
    this.#pos.y = value.y
  }

  get bounds (): TRect {
    return Rect.size(TextMeasurer.measureText(this.content, this.style))
  }

  toSurface (): Surface
  toSurface (clipRect: TRect): Surface
  toSurface (size: TSize): Surface
  toSurface (width: number, height: number): Surface
  toSurface (...args: Array<any>): Surface {
    let w = this.#mitrics.width + (this.style.outlineWidth)
    let h = this.#mitrics.height + 1 + (this.style.outlineWidth * 2)

    this.#pos.x = 0
    this.#pos.y = 0

    if (args.length === 1 && args[0] && typeof args[0] === 'object' && typeof args[0].width === 'number' && typeof args[0].height === 'number') {
      w = args[0].width
      h = args[0].height
    }

    if (args.length === 1 && args[0] && typeof args[0] === 'object' && typeof args[0].x === 'number' && typeof args[0].y === 'number') {
      this.#pos.x = args[0].x
      this.#pos.y = args[0].y
    }

    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      w = args[0]
      h = args[1]
    }

    this.#mitrics = TextMeasurer.measureText(this.content, this.style)
    const result = new Surface(w, h)
    this.draw(result)
    return result
  }

  clone (): Text {
    return new Text(this.content, this.style.clone())
  }
}


function assignTextStyle (ctx: CanvasRenderingContext2D, style: TextStyle) {
  const stl = style || {} as TTextStyle
  ctx.fillStyle = stl.color
  ctx.strokeStyle = stl.outlineColor
  if (stl.outlineWidth) ctx.lineWidth = stl.outlineWidth
  const fontName = stl.fontName || 'serif'
  const fontSize = stl.fontSize || '10pt'
  const bold = typeof stl.bold === 'boolean' && stl.bold ? 'bold ' : stl.bold ? stl.bold : 'normal'
  const italic = stl.italic ? 'italic ' : 'normal'
  const fontVariant = stl.fontVariant ?? 'normal'
  ctx.font = `${italic} ${bold} ${fontVariant} ${fontSize} ${fontName}`
  ctx.letterSpacing = stl.letterSpacing
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
  private static _defaultCanvas: HTMLCanvasElement | null = null
  private static getGefaultCanvas () {
    if (this._defaultCanvas) return this._defaultCanvas
    return this._defaultCanvas = document.createElement('canvas')
  } 
  
  private static getDefaultCtx() {
    return this.getGefaultCanvas().getContext('2d')!
  } 

  static measureText (text: string, style: TextStyle): { width: number, height: number } {
    const ctx = TextMeasurer.getDefaultCtx()
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
    const stl = style || {} as TTextStyle
    ctx.fillStyle = stl.color 
    const fontName = stl.fontName || 'serif'
    const fontSize = stl.fontSize || '10pt'
    const bold = typeof stl.bold === 'boolean' && stl.bold ? 'bold ' : stl.bold ? stl.bold : 'normal'
    const italic = stl.italic ? 'italic ' : 'normal'
    const fontVariant = stl.fontVariant ?? 'normal'
    ctx.font = `${italic} ${bold} ${fontVariant} ${fontSize} ${fontName}`
    ctx.letterSpacing = stl.letterSpacing
    ctx.lineWidth = stl.outlineWidth
  }

  private static getWidth (text: string, style: TextStyle): number {
    const ctx = TextMeasurer.getDefaultCtx()
    return this.measureTextInt(ctx, text, style).width
  }

  private static getHeight (_: string, style: TextStyle, metrics: TextMetrics) {
    if (metrics.actualBoundingBoxAscent && metrics.actualBoundingBoxDescent) {
      return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent 
    }
    return TextMeasurer.getWidth('M', style) 
  }
}

