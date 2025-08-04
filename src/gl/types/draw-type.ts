export type DrawType = 
  | 'static' 
  | 'static-read' 
  | 'static-copy'
  | 'dynamic' 
  | 'dynamic-read' 
  | 'dynamic-copy' 
  | 'stream'
  | 'stream-read'
  | 'stream-copy'

  export function getGlDrawType (gl: WebGL2RenderingContext, type: DrawType): number {
    switch (type) {
      case "static": return gl.STATIC_DRAW
      case "static-read": return gl.STATIC_READ
      case "static-copy": return gl.STATIC_COPY
      case "dynamic": return gl.DYNAMIC_DRAW
      case "dynamic-read": return gl.DYNAMIC_READ
      case "dynamic-copy": return gl.DYNAMIC_COPY 
      case "stream": return gl.STREAM_DRAW
      case "stream-read": return gl.STREAM_READ
      case "stream-copy": return gl.STREAM_COPY
    }
  }