export function int2Str (value: number): string {
  return '#' + ((value >> 16) & 0xff).toString(16) + ((value >> 8) & 0xff).toString(16) + (value & 0xff).toString(16)
}