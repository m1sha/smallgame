
function hex2rgb (hex: string): [number, number, number, number] {
  if (hex.length === 4) {
    const r = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16) / 255
    const g = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16) / 255
    const b = parseInt(hex.substring(3, 4) + hex.substring(3, 4), 16) / 255
    return [r, g, b, 1]
  }
  if (hex.length === 7) {
    const r = parseInt(hex.substring(1, 3), 16) / 255
    const g = parseInt(hex.substring(3, 5), 16) / 255
    const b = parseInt(hex.substring(5, 7), 16) / 255
    return [r, g, b, 1]
  }
  if (hex.length === 9) {
    const r = parseInt(hex.substring(1, 3), 16) / 255
    const g = parseInt(hex.substring(3, 5), 16) / 255
    const b = parseInt(hex.substring(5, 7), 16) / 255
    const a = parseInt(hex.substring(7, 9), 16) / 255
    return [r, g, b, a]
  }
  throw new Error('hex length is invalid')
}


export function fromString (value: string): [number, number, number, number] {
  if (value.charAt(0) === '#') return hex2rgb(value)

  throw new Error('Unsupported argument format.')
}