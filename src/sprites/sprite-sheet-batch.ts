export class SpriteSheetBatch {
  constructor (
    public readonly startIndex: number, 
    public readonly count: number, 
    public readonly name: string,
    public readonly rate?: number) {
  }
}

type Name = string
type Count = number
type Start = number
export type TSpriteSheetBatchScheme = Record<Name, Count | [Start, Count]>