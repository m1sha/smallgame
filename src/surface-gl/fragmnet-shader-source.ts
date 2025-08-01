export class FragmnetShaderSource {
  constructor (public source: string) {

  }

  readonly imports = new ShaderSourceImportCollection()

  toString () {
    if (!this.source) return undefined
    const index = this.source.indexOf('mainImage')
    if (index < 0)
      return this.source
    return this.parseSource()
  }

  private parseSource () {
    const src = this.source
    const lines = src.split('\n')

    let text = ''
    
    text += 'out vec4 fragColor;\n'
    text += 'uniform vec2 iResolution;\n'
    
    
    for (const line of lines) {
      
      if (line.indexOf('mainImage') > -1) {
        const bracket = line.indexOf('{') > -1 ? ' {' : ''
        text += 'void main()' + bracket  + '\n'
        continue
      }

      if (line.indexOf('#import')> -1) {
        if (line.trimStart().startsWith('//')) continue
        const [_, libName] = line.split('from', 2).map(p => p.trim().replaceAll("'", '').replaceAll('"', ''))
        const value = this.imports.items[libName]
        text += value
        continue
      }


      text += line + '\n'
    }

    return text
  }
}

export class ShaderSourceImportCollection {
  items: Record<string, string> = {}
  
  add (libName: string, libSource: string) {
    this.items[libName] = libSource
  }
}