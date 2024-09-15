/* global CanvasLineCap, CanvasLineJoin */

import { PaintOrder } from "./paint-order"

export type TShapeStyle = {
  fill?: string
  stroke?: string
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
  fill: string
  stroke: string
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
    this.lineCap = 'butt'
    this.lineDashOffset = 0
    this.lineDash = []
    this.lineJoin = 'bevel'
    this.lineWidth = style.lineWidth ?? 1
    this.miterLimit = 0
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
  ctx.strokeStyle = style.stroke
  ctx.lineWidth = style.lineWidth || 1
  ctx.lineJoin = style.lineJoin || 'bevel'
  if (style.lineDash) ctx.setLineDash(style.lineDash)
  ctx.lineDashOffset = style.lineDashOffset || 0
  ctx.lineCap = style.lineCap || 'butt'
  
}

