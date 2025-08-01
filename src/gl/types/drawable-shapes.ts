export type GlShape = 'points' | 'lines' | 'line-strip' | 'line-loop' | 'triangles' | 'triangle-strip' | 'triangle-fan'

export function getShape (gl: WebGL2RenderingContext, type: GlShape): number {
  switch (type) {
    case "points": return gl.POINTS
    case "lines": return gl.LINES
    case "line-strip": return gl.LINE_STRIP
    case "line-loop": return gl.LINE_LOOP
    case "triangles": return gl.TRIANGLES
    case "triangle-strip": return gl.TRIANGLE_STRIP
    case "triangle-fan": return gl.TRIANGLE_FAN
  }
}
