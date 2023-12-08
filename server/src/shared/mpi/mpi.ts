export type TypedEvent<Type, Payload> = {
  type: Type
  payload: Payload
}

export const enum MessagePassingInterfaceErrorKind {
  TimeoutExceeded = 'TimeoutExceeded',
}

export type MessagePassingInterfaceErrorType = {
  type: MessagePassingInterfaceErrorKind.TimeoutExceeded
}

export class MessagePassingInterfaceError extends Error {
  name = 'MessagePassingInterfaceError'

  constructor(public readonly cause: MessagePassingInterfaceErrorType) {
    super()
  }
}

export type UnsubscribeFn = () => void
export type WhenOptions<O> = {
  timeoutMs?: number
  filter?: MessageFilterFn<O>
}
export type MessageListener<O> = (msg: O) => void
export type MessageFilterFn<O> = (msg: O) => boolean

export interface IMessagePassingInterface<
  I extends TypedEvent<any, any>,
  O extends TypedEvent<any, any>,
  OT = O extends TypedEvent<infer OT, infer _OP> ? OT : never,
> {
  send(msg: I): void
  listen(listener: MessageListener<O>): UnsubscribeFn
  on<T extends OT>(
    type: T,
    listener: MessageListener<O & { type: T }>,
  ): UnsubscribeFn
  when(options?: WhenOptions<O>): Promise<O>
  wait<T extends OT>(
    type: T,
    options?: WhenOptions<O>,
  ): Promise<O & { type: T }>
}
