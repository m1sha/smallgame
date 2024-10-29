import { knowledgeTypes, vertexOf } from "./types"

type VertexAttribPointerAttrib = {
  name: string
  size: number
}

export type VertexAttribPointerTemplate = {
  size: number
  attributes: VertexAttribPointerAttrib[]
}

export function getVertexAttribPointerTemplate (scheme: {}): VertexAttribPointerTemplate {
  const names = Reflect.ownKeys(scheme)
  const result: VertexAttribPointerTemplate = { size: 0, attributes: [] }
  const list: {name: string, type: string } [] = []
    
  for (const name of names) {
    const prop = Reflect.get(scheme, name) as any
    if (!knowledgeTypes.includes(prop.name)) throw new Error('unsupported type ' + prop.name)
      
    result.size += vertexOf(prop.name) 
    list.push({ name: name as any, type: prop.name })
  }

  for (const item of list) {
    result.attributes.push({
      name: item.name,
      size: vertexOf(item.type as any),
    })
  }
    
  return result
}
