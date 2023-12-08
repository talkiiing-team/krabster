export type ImageBreakpoint = {
  width: number
  url: string
  retinaUrl?: string
}

export type ImageInfo = {
  width: number
  height: number
  url: string

  alt?: string
  loading?: 'lazy' | 'eager'
  aspectRatio?: number
  breakpoints?: ImageBreakpoint[]
}
