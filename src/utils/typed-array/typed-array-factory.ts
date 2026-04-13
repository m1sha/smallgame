import { ITypedArray, TypedArrayType } from "./typed-array"

export function createTypedArray (type: TypedArrayType, lengthOrArr: number | number[]): ITypedArray {
  switch (type) {
    case 'f32': return new Float32Array(lengthOrArr as any)
    case 'f64': return new Float64Array(lengthOrArr as any)
    case 'i8': return new Int8Array(lengthOrArr as any)
    case 'i16': return new Int16Array(lengthOrArr as any)
    case 'i32': return new Int32Array(lengthOrArr as any)
    case 'i64': return new BigInt64Array(lengthOrArr as any) as any as ITypedArray
    case 'u8': return new Uint8Array(lengthOrArr as any)
    case 'u16': return new Uint16Array(lengthOrArr as any)
    case 'u32': return new Uint32Array(lengthOrArr as any)
    case 'u64': return new BigUint64Array(lengthOrArr as any) as any as ITypedArray
    case 'u8C': return new Uint8ClampedArray(lengthOrArr as any)
    default: return new Float32Array(lengthOrArr as any)
  }
}

export function isTypedArray (arr: number[] | Array<number> | ArrayLike<number>): boolean {
  if (arr instanceof Float32Array) return true
  if (arr instanceof Float64Array) return true
  if (arr instanceof Int8Array) return true
  if (arr instanceof Int16Array) return true
  if (arr instanceof Int32Array) return true
  if (arr instanceof BigInt64Array) return true
  if (arr instanceof Uint8Array) return true
  if (arr instanceof Uint16Array) return true
  if (arr instanceof Uint32Array) return true
  if (arr instanceof BigUint64Array) return true
  if (arr instanceof Uint8ClampedArray) return true
  return false
}