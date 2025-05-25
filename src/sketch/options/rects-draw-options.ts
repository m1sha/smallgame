export type TRectDrawOptions = {
  skipRows?: number
  gap?: number
}

export class RectDrawOptions implements TRectDrawOptions {
  skipRows: number
  gap: number

  constructor (opt?: TRectDrawOptions) {
    this.skipRows = opt && opt.skipRows ? opt.skipRows : 0
    this.gap = opt && opt.gap ? opt.gap : 0
  }
}