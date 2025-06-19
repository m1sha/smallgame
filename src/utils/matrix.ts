export class Matrix {
  #array: number[] = []
  readonly cols: number = 0
  readonly rows: number = 0

  constructor (cols: number, rows: number) {
    this.cols = cols
    this.rows = rows
  }

  get T (): Matrix {
    return new Matrix(this.rows, this.cols)
  }
}