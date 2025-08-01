const Primitive2D = {
  // @ts-ignore
  rect (gap?: number) {
    const d = gap ? gap : 0
    
    return [
      -1.0 + d, 1.0 - d,
      -1.0 + d, -1.0 + d,
      1.0 - d, 1.0 - d,
      1.0 -d, -1.0 +d
    ]
  }
}

export { Primitive2D }