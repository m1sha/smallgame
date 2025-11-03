export type TArrowDrawOptions = {
  start?: TArrowheadOptions
  end?: TArrowheadOptions
}

export type TArrowheadOptions = {
  arrowRadius?: number, 
  arrowAngle?: number 
}

export class ArrowDrawOptions {
  start: TArrowheadOptions | null = null
  end: TArrowheadOptions | null = null

  static from (opt?: TArrowDrawOptions) {
    const result = new ArrowDrawOptions()
    
    if (opt && opt.start) {
      result.start = {
        arrowAngle: typeof opt.start.arrowAngle === 'number' ? opt.start.arrowAngle: 12,
        arrowRadius: typeof opt.start.arrowRadius === 'number' ? opt.start.arrowRadius: Math.PI / 7,
      }
    }

    if (opt && opt.end) {
      result.end = {
        arrowAngle: typeof opt.end.arrowAngle === 'number' ? opt.end.arrowAngle: 12,
        arrowRadius: typeof opt.end.arrowRadius === 'number' ? opt.end.arrowRadius: Math.PI / 7,
      }
    }

    return result
  }
}