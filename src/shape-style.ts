export type TShapeStyle = {
  fill?: string
  stroke?: string
}

export class ShapeStyle {
  fill: string
  stroke: string

  constructor (style: TShapeStyle) {
    this.fill = style.fill ?? "#fff"
    this.stroke = style.stroke ?? "#222"
  }
}