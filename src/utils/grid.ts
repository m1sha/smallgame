import { Size, TSize } from "../size"
import { Rect, TRect } from "../rect"

export class Grid {
  rect: TRect = Rect.zero
  rows: number = 0
  cols: number = 0
  cellSize: TSize = new Size(0, 0)

  cell (row: number, col: number): Rect {
    return new Rect(this.cellSize.width * col + this.rect.x, this.cellSize.height * row + this.rect.y, this.cellSize.width, this.cellSize.height)
  }

  static fromDim (rows: number, cols: number, rect: TRect) {
    const grid = new Grid()
    grid.rect = rect
    grid.rows = rows
    grid.cols = cols
    grid.cellSize = new Size(rect.width / cols, rect.height / rows)
    return grid
  }
  static fromSize (rect: TRect, cellSize: TSize) {}
}