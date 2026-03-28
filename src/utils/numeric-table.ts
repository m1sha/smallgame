type DataType = 'f32' | 'f64' | 'i8' | 'i16' | 'i32' | 'u8' | 'u16' | 'u32' | 'u8C' 

interface TypedArray {
  [index: number]: number
  readonly length: number
  readonly buffer: ArrayBuffer
  fill: (value: number) => void
  subarray: (begin?: number, end?: number) => TypedArray
  slice: (start?: number | undefined, end?: number | undefined) => TypedArray
  set: (array: ArrayLike<number>, offset?: number | undefined) => void
  copyWithin: (target: number, start: number, end?: number | undefined) => TypedArray
}

export class NumericTable {
  #rows: number
  #cols: number
  #data: TypedArray

  constructor(rows: number, cols: number, private defaultValue: number = 0, private type: DataType = 'f32') {
    this.#rows = rows  
    this.#cols = cols
    this.#data = this.createArray(rows * cols)
    this.defaultValue ??= 0
    this.#data.fill(this.defaultValue)
  }

  get rows () {
    return this.#rows
  }

  get cols () {
    return this.#cols
  }

  get cellCount () {
    return this.#data.length
  }

  cell (row: number, col: number, value?: number) {
    if (typeof value === 'number') {
      this.#data[this.getIndex(row, col)] =  value
      return value
    }

    return this.#data[this.getIndex(row, col)]
  }

  set (row: number, col: number, data: number[], dataRows: number, dataCols: number) {
    const arr = this.arrayFrom(data)
    for (let i = 0; i < dataRows; i++) {
      const offset = i * dataCols
      const sub = arr.subarray(offset, offset + dataCols)
      this.#data.set(sub, (i + row) * this.#cols + col)
    }
  }

  appendRows (count: number, value?: number) {
    if (count === 0) return
    const rows = this.#rows + Math.abs(count)
    const data = this.createArray(rows * this.#cols)
    if (count > 0) {
      data.set(this.#data)
      data.fill(value ?? this.defaultValue, this.#rows * this.#cols)
      
    } else {
      const offset = Math.abs(count) * this.#cols
      data.set(this.#data, offset)
      data.fill(value ?? this.defaultValue, 0, offset)
    }

    this.#data = data
    this.#rows = rows
  }

  appendColumns (count: number, value?: number) {
    if (count === 0) return
    const cols = this.#cols + Math.abs(count)
    const data = this.createArray(this.#rows * cols)

    data.fill(value ?? this.defaultValue)
    const offset = count > 0 ? 0: Math.abs(count)
    for (let i = 0; i < this.#rows; i++) {
      const sub = this.#data.subarray(i * this.#cols, this.#cols)
      data.set(sub, i * cols + offset)
    }

    this.#data = data
    this.#cols = cols
  }

  insertRows (start: number, count: number = 1, value?: number) {
    if (count < 0) throw new Error('A count must be positive value.')
    if (count === 0) return
    const rows = this.#rows + count
    const data = this.createArray(rows * this.#cols)
    data.fill(this.defaultValue)

    const begin = start >= 0 ? start : this.#rows + start
    const sub0 = this.#data.subarray(0, begin * this.#cols)
    data.set(sub0, 0)
    if (typeof value === 'number') {
      data.fill(value, begin * this.#cols, (begin + count) * this.#cols)
    }
    const sub1 = this.#data.subarray(begin * this.#cols)
    data.set(sub1, (begin + count) * this.#cols)

    this.#data = data
    this.#rows = rows
  }

  insertColumns (start: number, count: number = 1, value?: number) {
    if (count < 0) throw new Error('A count must be positive value.')
    if (count === 0) return
    const cols = this.#cols + count
    const data = this.createArray(cols * this.#rows)
    data.fill(this.defaultValue)

    const begin = start >= 0 ? start : this.#cols + start

    for (let i = 0; i < this.#rows; i++) {
      const offset = i * this.#cols
      const offset2 = i * cols
      const sub0 = this.#data.subarray(offset, offset + begin)
      const sub1 = this.#data.subarray(offset + begin, offset + this.#cols)
      
      data.set(sub0, offset2)
      data.set(sub1, begin + count + offset2)
      if (typeof value === 'number')
        data.fill(value, offset2 + begin, begin + count + offset2)
    }

    this.#data = data
    this.#cols = cols
  }

  deleteLastRows (count: number = 1) {
    if (count === 0) return
    const rows = this.#rows - Math.abs(count)
    const data = this.createAndFillData(rows, this.#cols, this.defaultValue)
    const start = count > 0 ? 0 : Math.abs(count) * this.#cols
    const offset = count > 0 ? data.length : undefined
    const sub = this.#data.subarray(start, offset)
    data.set(sub, 0)
    this.#data = data
    this.#rows = rows
  }

  deleteLastColumns (count: number = 1) {
    if (count === 0) return
    const cols = this.#cols - Math.abs(count)
    const data = this.createAndFillData(this.#rows, cols, this.defaultValue)
    const start = count > 0 ? 0 :  Math.abs(count)
    const offset =  count > 0 ? cols : this.#cols

    for (let i = 0; i < this.#rows; i++) {
      const row = i * this.#cols
      const sub = this.#data.subarray(row + start, row + offset)
      data.set(sub, i * cols)
    }

    this.#data = data
    this.#cols = cols
  }

  deleteRows (start: number, count: number = 1) {
    if (count < 0) throw new Error('A count must be positive value.')
    if (count === 0) return

    const rows = this.#rows - count
    const data = this.createAndFillData(rows, this.#cols, this.defaultValue)

    const begin = start
    if (start > 0) {
      const sub0 = this.#data.subarray(0, begin * this.#cols)
      const sub1 = this.#data.subarray((begin + count) * this.#cols)
      data.set(sub0)
      data.set(sub1, sub0.length)
    } else {

    }

    this.#data = data
    this.#rows = rows
  }

  deleteColumns (start: number, count: number = 1) {
    if (count < 0) throw new Error('A count must be positive value.')
    if (count === 0) return

    const cols = this.#cols - count
    const data = this.createAndFillData(this.#rows, cols, this.defaultValue)

    for (let i = 0; i < this.#rows; i++) {
      const offset1 = i * this.#cols
      const offset2 = i * cols
      const sub0 = this.#data.subarray(offset1, offset1 + start)
      const sub1 = this.#data.subarray(offset1 + start + count, offset1 + this.#cols)

      data.set(sub0, offset2)
      data.set(sub1, offset2 + sub0.length)
    }

    this.#data = data
    this.#cols = cols
  }

  shiftRows (start: number, count: number = 1, shift: number = 1) {

  }

  shiftColumns (start: number, count: number = 1, shift: number = 1) {

  }

  getIndex (row: number, col: number) {
    return row * this.#cols + col
  }

  private createAndFillData (rows: number, cols: number, value: number) {
    const data = this.createArray(rows * cols)
    data.fill(value)
    return data
  }

  private createArray (size: number) {
    switch (this.type) {
      case 'f32': return new Float32Array(size)
      case 'f64': return new Float64Array(size)
      case 'i8': return new Int8Array(size)
      case 'i16': return new Int16Array(size)
      case 'i32': return new Int32Array(size)
      case 'u8': return new Uint8Array(size)
      case 'u16': return new Uint16Array(size)
      case 'u32': return new Uint32Array(size)
      case 'u8C': return new Uint8ClampedArray(size)
      default: return new Float32Array(size)
    }
  }

  private arrayFrom (arr: number[] | Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray): TypedArray {
    if (arr instanceof Float32Array) return arr as TypedArray
    if (arr instanceof Float64Array) return arr as TypedArray
    if (arr instanceof Int8Array) return arr as TypedArray
    if (arr instanceof Int16Array) return arr as TypedArray
    if (arr instanceof Int32Array) return arr as TypedArray
    if (arr instanceof Uint8Array) return arr as TypedArray
    if (arr instanceof Uint16Array) return arr as TypedArray
    if (arr instanceof Uint32Array) return arr as TypedArray
    if (arr instanceof Uint8ClampedArray) return arr as TypedArray

    switch (this.type) {
      case 'f32': return new Float32Array(arr)
      case 'f64': return new Float64Array(arr)
      case 'i8': return new Int8Array(arr)
      case 'i16': return new Int16Array(arr)
      case 'i32': return new Int32Array(arr)
      case 'u8': return new Uint8Array(arr)
      case 'u16': return new Uint16Array(arr)
      case 'u32': return new Uint32Array(arr)
      case 'u8C': return new Uint8ClampedArray(arr)
      default: return new Float32Array(arr)
    }
  }
}