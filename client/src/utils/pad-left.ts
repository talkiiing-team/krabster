export type Stringable = unknown & { toString: CallableFunction }

/**
 * @example padLeft(minutes, '0', 2) + ':' + padLeft(seconds, '0', 2)
 */
export const padLeft = (value: Stringable, pad: string, length: number) => {
  const _value = value.toString()
  return pad.repeat(Math.max(length - _value.length, 0)) + _value
}
