import { Hex, HexagonOrientation } from "./hex"



export class HexGrid {
  #cellSize: number
  #orientation: HexagonOrientation

  constructor (rows: number, cols: number, cellSize: number, orientation: HexagonOrientation) {
    this.#cellSize = cellSize
    this.#orientation = orientation
  }

  x: number = 0
  y: number = 0

  cell (row: number, col: number): Hex {
    let { x, y } = Hex.offset(row, col, this.#cellSize, this.#orientation)
    x += this.x
    y += this.y
    return new Hex(0 | x, 0 | y, this.#cellSize, this.#orientation)
  }
}