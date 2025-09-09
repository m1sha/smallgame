export interface IMipmapOptions {
  level?: number
  maxLevel?: number
  baseLevel?: number
}

export interface ITextureOptions {
  minMag: 'nearest' | 'linear'
  mipmap?: IMipmapOptions
  wrapS?: 'repeat' | 'mirrored-repeat' | 'clamp-to-edge'
  wrapT?: 'repeat' | 'mirrored-repeat' | 'clamp-to-edge'
  flipY?: boolean
}
