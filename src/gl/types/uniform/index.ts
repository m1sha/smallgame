import { u_int, u_float, u_vec2, u_vec3, u_vec4, u_mat4 } from "./types"
export * from "./types"

export interface IGlUniformTypeMap {
  'int': u_int
  'float': u_float
  'vec2': u_vec2
  'vec3': u_vec3
  'vec4': u_vec4
  'mat4': u_mat4
}

const GlUniformTypeMap = {
  'int': u_int,
  'float': u_float,
  'vec2': u_vec2,
  'vec3': u_vec3,
  'vec4': u_vec4,
  'mat4': u_mat4
}

export { GlUniformTypeMap  }