const Primitive2D = {
  // @ts-ignore
  rect (x?: number, y?: number, w?: number, h?: number) {
    return [
      -1.0, 1.0,
      -1.0, -1.0,
      1.0, 1.0,
      1.0, -1.0
    ]
  }
}

export { Primitive2D }