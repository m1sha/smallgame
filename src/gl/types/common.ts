export class bool {}
export class int {}
export class uint {}
export class float {}
export class vec2 {}
export class uvec2 {}
export class ivec2 {}
export class bvec2 {}
export class vec3 {}
export class uvec3 {}
export class ivec3 {}
export class bvec3 {}
export class vec4 {}
export class uvec4 {}
export class ivec4 {}
export class bvec4 {}
export class mat2 {}
export class mat3 {}
export class mat4 {}
export class mat2x3 {}
export class mat2x4 {}
export class mat3x2 {}
export class mat3x4 {}
export class mat4x2 {}
export class mat4x3 {}
export class sampler2D {}
export class samplerCube {}

const knowledgeTypes = [
  'bool',
  'int',
  'uint',
  'float', 
  'vec2',
  'uvec2',
  'ivec2', 
  'bvec2', 
  'vec3',
  'uvec3', 
  'ivec3', 
  'bvec3', 
  'vec4',
  'uvec4', 
  'ivec4', 
  'bvec4', 
  'mat2',
  'mat3',
  'mat4',
  'mat2x3',
  'mat2x4',
  'mat3x2',
  'mat3x4',
  'mat4x2',
  'mat4x3',
  'sampler2D',
  'samplerCube'
] as const

type KnowledgeTypes = typeof knowledgeTypes[number]
type GLSLTypes = typeof bool | typeof int | typeof uint | typeof float | typeof vec2 | typeof uvec2 | typeof ivec2 | typeof bvec2 | typeof vec3 | typeof uvec3 | typeof ivec3 | typeof bvec3 | typeof vec4 | typeof uvec4 | typeof ivec4 | typeof bvec4 | typeof mat2 | typeof mat3 | typeof mat4 | typeof mat2x3 | typeof mat2x4 | typeof mat3x2 | typeof mat4x2 | typeof mat4x3 | typeof sampler2D | typeof samplerCube

export function vertexOf (typeName: KnowledgeTypes) {
  switch (typeName) {
    case "bool": return 1
    case "int": return 1
    case "uint": return 1
    case "float": return 1
    case "vec2": return 2
    case "uvec2": return 2
    case "ivec2": return 2
    case "bvec2": return 2
    case "vec3": return 3
    case "uvec3": return 3
    case "ivec3": return 3
    case "bvec3": return 3
    case "vec4": return 4
    case "uvec4": return 4
    case "ivec4": return 4
    case "bvec4": return 4
    case "mat2": return 4
    case "mat3": return 9
    case "mat4": return 16
    case "mat2x3": return 6
    case "mat2x4": return 8
    case "mat3x2": return 6
    case "mat3x4": return 12
    case "mat4x2": return 8
    case "mat4x3": return 12
    case "sampler2D": return 0
    case "samplerCube": return 0
  }
}

export function sizeOf (_/*typeName*/: string) {
  return 4
}

export function getGlType (type: 'float' | 'short' | 'byte' | 'ushort' | 'ubyte'): number {
  switch (type) {
    case "float": return 0x1406
    case "short": return 0x1402
    case "byte": return 0x1400
    case "ushort": return 0x1403
    case "ubyte": return 0x1401
  }
}

export function getGlTypeSize (type: 'float' | 'short' | 'byte' | 'ushort' | 'ubyte'): number {
  switch (type) {
    case "float": return 4
    case "short": return 1
    case "byte": return 1
    case "ushort": return 1
    case "ubyte": return 1
  }
}


export { knowledgeTypes, type GLSLTypes }
