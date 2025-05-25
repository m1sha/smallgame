/* global CanvasLineCap, CanvasLineJoin */

import { Surface } from "../surface"
import { TColorSource } from "./color-source"
import { PaintOrder } from "./paint-order"

export type ShapeStyleTypes = TShapeStyle | ShapeStyle | string

export type TShapeStyle = {
  fill?: TColorSource
  stroke?: TColorSource
  lineCap?: CanvasLineCap
  lineDashOffset?: number
  lineDash?: number[]
  lineJoin?: CanvasLineJoin
  lineWidth?: number
  ddaline?: boolean
  miterLimit?: number
  paintOrder?: PaintOrder
}

export class ShapeStyle {
  fill: TColorSource
  stroke: TColorSource
  lineCap: CanvasLineCap
  lineDashOffset: number
  lineDash: number[]
  lineJoin: CanvasLineJoin
  lineWidth: number
  ddaline: boolean
  miterLimit: number
  paintOrder?: PaintOrder

  constructor (style: TShapeStyle) {
    this.fill = style.fill ?? "transparent"
    this.stroke = style.stroke ?? "transparent"
    this.lineCap = style.lineCap ?? 'butt'
    this.lineDashOffset = style.lineDashOffset ?? 0
    this.lineDash = style.lineDash ?? []
    this.lineJoin = style.lineJoin ?? 'bevel'
    this.lineWidth = style.lineWidth ?? 1
    this.miterLimit = style.miterLimit ?? 0
    this.ddaline = Boolean(style.ddaline) && style.lineWidth === 1
  }

  static from(style: TShapeStyle | ShapeStyle): ShapeStyle {
    if (style instanceof ShapeStyle) return style
    return new ShapeStyle(style)
  }

  clone () {
    return new ShapeStyle(this)
  }

}

export function applyStroke (ctx: CanvasRenderingContext2D, style: ShapeStyle) {
  if (style.stroke instanceof Surface) {
    ctx.strokeStyle = style.stroke.draw.origin
  } else {
    ctx.strokeStyle = style.stroke
  }
  
  ctx.lineWidth = style.lineWidth || 1
  ctx.lineJoin = style.lineJoin || 'bevel'
  if (style.lineDash) ctx.setLineDash(style.lineDash)
  ctx.lineDashOffset = style.lineDashOffset || 0
  ctx.lineCap = style.lineCap || 'butt'
}

export function applyFill (ctx: CanvasRenderingContext2D, color: TColorSource) {
  ctx.fillStyle = color
}

export class ShapeStyleResolver {
  constructor (private style: ShapeStyleTypes | ShapeStyleTypes[] | ShapeStyleTypes[][]) {
  }

  get (col: number, row: number): ShapeStyleTypes {
    if (Array.isArray(this.style)) {
      const styles = this.style
      
      if (Array.isArray(styles[0])) {
        const stylesList = styles as ShapeStyleTypes[][]
        const j = col >= styles.length ? 0 | col % this.style.length  : col
        const styleList = styles[j] as ShapeStyleTypes[]
        const i = row >= styleList.length ? 0 | row % styleList.length : row
        return  stylesList[j][i]
      }
      
      const j = col >= this.style.length ? col % this.style.length : col  
      return this.style[j] as ShapeStyleTypes
    }

    if (!Array.isArray(this.style)) {
      return this.style
    }

    throw new Error('Unsupported arguments.')
  }
}

