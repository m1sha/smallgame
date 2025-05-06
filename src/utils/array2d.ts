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

  private getIndex (row: number, col: number) {
    return this.cols * row + col
  }
}