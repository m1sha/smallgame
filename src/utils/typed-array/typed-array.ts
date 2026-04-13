export interface ITypedArray {
  [index: number]: number
  readonly length: number
  readonly buffer: ArrayBuffer
  fill: (value: number, start?: number, end?: number) => void
  subarray: (begin?: number, end?: number) => ITypedArray
  slice: (start?: number | undefined, end?: number | undefined) => ITypedArray
  set: (array: ArrayLike<number>, offset?: number | undefined) => void
  copyWithin: (target: number, start: number, end?: number | undefined) => ITypedArray
}

export type TypedArrayType = 'f32' | 'f64' | 'i8' | 'i16' | 'i32' | 'i64' | 'u8' | 'u16' | 'u32' | 'u64' | 'u8C' 