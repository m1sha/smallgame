import { GlAttributeLocation } from "./base"

export class a_float extends GlAttributeLocation {
  // value: number = 0
  set value (value: number) {
    this.gl.vertexAttrib1f(this.origin, value)
  }
}

export class a_vec2 extends GlAttributeLocation {
  //value: [number, number] = [0, 0]
  set value (value: [number, number]) {
    //this.value = [value1, value2]
    this.gl.vertexAttrib2f(this.origin, value[0], value[1])
  }
}

export class a_vec3 extends GlAttributeLocation {
  // value: [number, number, number] = [0, 0, 0]

  set value (value: [number, number, number]) {
    //this.value = [value1, value2]
    this.gl.vertexAttrib3f(this.origin, value[0], value[1], value[2])
  }
}

export class a_pointer_array extends GlAttributeLocation {
  set (size: number, type: number, normalized: boolean, stride: number, offset: number) {
    this.gl.vertexAttribPointer(this.origin, size, type, normalized, stride, offset)
  }

  enable () {
    this.gl.enableVertexAttribArray(this.origin)
  }
}

