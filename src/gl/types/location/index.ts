import { a_float, a_pointer_array, a_vec2, a_vec3 } from "./types"
export * from "./types"

export interface IGlAttributeTypeMap {
  'float': a_float
  'vec2': a_vec2
  'vec3': a_vec3
  'pointer_array': a_pointer_array
}

const GlAttributeTypeMap = {
  'float': a_float,
  'vec2': a_vec2,
  'vec3': a_vec3,
  'pointer_array': a_pointer_array
}

export { GlAttributeTypeMap  }