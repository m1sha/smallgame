import { type VertexAttribPointerTemplate } from "./utils"

// type TVertexArray = Float32Array | Int32Array | Uint32Array

export class GlVertexArray {
  #gl: WebGL2RenderingContext
  #template: VertexAttribPointerTemplate
  #data: number[] = []
  count: number = 0

  constructor (gl: WebGL2RenderingContext, template: VertexAttribPointerTemplate) {
    this.#gl = gl  
    this.#template = template
  }


  push (...items: Array<number[]>) {
    const attrs = this.#template.attributes
    const len = items.length
    if (len > attrs.length) throw new Error('Paramters more than attributes.')

    if (items.length === 1) {
      this.#data = items[0]
      this.pushData()
      this.count = items[0].length / this.#template.size
      return this.count
    }
    
    const indexies: number[] = new Array(items.length).fill(0)
    const result: number[] = []
    let stop = false
    let count = this.getCount(items) / this.#template.size
    this.count = count

    while (!stop) {

      stop = true
      for (const index of indexies) {
        stop &&= index > count + 1
      }

      for (let i = 0; i < len; i++) {
        const item = items[i]
        const size = attrs[i].size
        
        for (let j = 0; j < size; j++) {
          const val = item[indexies[i]++]
          result.push(val)
        }
      }
      
    }

    this.#data = result
    this.pushData()
    return count
  }

  private pushData() {
    const gl = this.#gl
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#data), gl.STATIC_DRAW)
  }

  private getCount(items: Array<number[]>) {
    let result = 0
    items.forEach(item => result += item.length)
    return result
  }
}