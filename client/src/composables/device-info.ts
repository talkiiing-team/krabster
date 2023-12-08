import { useMediaQuery } from '@vueuse/core'

export const useIsMobile = () =>
  useMediaQuery('(hover: none) and (pointer: coarse)')

export const isAndroid = () => navigator.userAgent.match(/Android/i) !== null
