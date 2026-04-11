export type Mat3x3 = Float32Array

export const MatrixUtils = {
  ortho2D (left: number, right: number, bottom: number, top: number): Mat3x3 {
    const matrix = new Float32Array(9)
    const rl = 1.0 / (right - left)
    const tb = 1.0 / (top - bottom)

    // Column 0
    matrix[0] = 2.0 * rl
    matrix[1] = 0
    matrix[2] = 0

    // Column 1
    matrix[3] = 0
    matrix[4] = 2.0 * tb
    matrix[5] = 0

    // Column 2
    matrix[6] = (right + left) * -rl
    matrix[7] = (top + bottom) * -tb
    matrix[8] = 1

    return matrix
  }
}