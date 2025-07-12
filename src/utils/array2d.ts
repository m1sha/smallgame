export class Array2D<T> {
  private items: T[]

  constructor (public readonly rows: number, public readonly cols: number, defaultValue?: T) {
    this.items = new Array<T>(rows * cols)
    
    if (typeof defaultValue !== 'undefined' && defaultValue !== undefined) {
      this.items.fill(defaultValue)
    }
  }

  get (row: number, col: number ): T {
    const index = this.getIndex(row, col)
    return this.items[index]
  }

  set (row: number, col: number, value: T) {
    const index = this.getIndex(row, col)
    this.items[index] = value
  }

  boundaryFill (row: number, col: number, value: T, predicate: (cell: T) => boolean) {
    if (!predicate(this.get(row, col))) return
     
    this.set(row, col, value)

    if (col + 1 < this.cols - 1)
      this.boundaryFill(row, col + 1, value, predicate)
    if (col - 1 > - 1)
      this.boundaryFill(row, col - 1, value, predicate)
    if (row + 1 < this.rows - 1)
      this.boundaryFill(row + 1, col, value, predicate)
    if (row - 1 > -1)
      this.boundaryFill(row - 1, col, value, predicate)
  }

  private getIndex (row: number, col: number) {
    return this.cols * row + col
  }
}