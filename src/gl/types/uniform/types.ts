import { GlUniformLocation } from './base'


export class u_int extends GlUniformLocation {
  get value () { return this.gl.getUniform(this.program, this.origin) }
  set value (value: number) {
    if (this.valid) this.gl.uniform1i(this.origin, value)
  }
}

export class u_float extends GlUniformLocation {
  get value () { return this.gl.getUniform(this.program, this.origin) }
  set value (value: number) {
    if (this.valid) this.gl.uniform1f(this.origin, value)
  }
}

export class u_vec2 extends GlUniformLocation {
  get value () { return this.gl.getUniform(this.program, this.origin) }
  set value (value: [number, number]) {
    if (this.valid) this.gl.uniform2f(this.origin, value[0], value[1])
  }
}

export class u_vec3 extends GlUniformLocation {
  get value () { return this.gl.getUniform(this.program, this.origin) }
  set value (value: [number, number, number]) {
    if (this.valid) this.gl.uniform3f(this.origin, value[0], value[1], value[2])
  }
}

export class u_vec4 extends GlUniformLocation {
  get value () { return this.gl.getUniform(this.program, this.origin) }
  set value (value: [number, number, number, number]) {
    if (this.valid) this.gl.uniform4f(this.origin, value[0], value[1], value[2], value[3])
  }
}

export class u_mat4 extends GlUniformLocation {
  get value () { return this.gl.getUniform(this.program, this.origin) }
  set value (value: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]) {
    if (this.valid) this.gl.uniformMatrix4fv(this.origin, false, value)
  }

  set (matrix: DOMMatrix) {
    this.value = [
      matrix.m11, matrix.m12, matrix.m13, matrix.m14,
      matrix.m21, matrix.m22, matrix.m23, matrix.m24,
      matrix.m31, matrix.m32, matrix.m33, matrix.m34,
      matrix.m41, matrix.m42, matrix.m43, matrix.m44
    ]
  }
}

