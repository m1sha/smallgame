/* global CanvasLineCap, CanvasLineJoin */

import { Surface } from "../surface"
import { TColorSource } from "./color-source"
import { PaintOrder } from "./paint-order"

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
if (color instanceof Surface) {
    ctx.fillStyle = color.draw.origin
  } else {
    ctx.fillStyle = color
  }
}

