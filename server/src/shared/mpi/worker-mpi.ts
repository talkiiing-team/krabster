import { Worker, MessagePort } from 'worker_threads'

import {
  IMessagePassingInterface,
  MessageListener,
  MessagePassingInterfaceError,
  MessagePassingInterfaceErrorKind,
  TypedEvent,
  UnsubscribeFn,
  WhenOptions,
} from './mpi'

export class MessagePassingInterface<
  I extends TypedEvent<any, any>,
  O extends TypedEvent<any, any>,
  OT = O extends TypedEvent<infer OT, infer _OP> ? OT : never,
> implements IMessagePassingInterface<I, O, OT>
{
  readonly #client: Worker | MessagePort
  readonly #listeners = new Set<MessageListener<O>>()

  constructor(client: Worker | MessagePort) {
    this.#client = client

    this.#client.on('message', (msg: O) =>
      this.#listeners.forEach(listener => listener(msg)),
    )
  }

  send(msg: I) {
    console.log('[MPI] Sending message', msg)
    this.#client.postMessage(msg)
  }

  listen(listener: MessageListener<O>): UnsubscribeFn {
    this.#listeners.add(listener)
    return () => this.#listeners.delete(listener)
  }

  on<T extends OT>(
    type: T,
    listener: MessageListener<O & { type: T }>,
  ): UnsubscribeFn {
    return this.listen(msg => {
      if (msg.type === type) {
        listener(msg as O & { type: T })
      }
    })
  }

  when(options: WhenOptions<O> = {}): Promise<O> {
    const filter = options.filter ?? (() => true)
    const timeoutMs = options.timeoutMs ?? 5_000

    return new Promise((res, rej) => {
      const unsubscribe = this.listen(msg => {
        if (filter(msg)) {
          unsubscribe()
          res(msg)
        }
      })

      setTimeout(() => {
        unsubscribe()
        rej(
          new MessagePassingInterfaceError({
            type: MessagePassingInterfaceErrorKind.TimeoutExceeded,
          }),
        )
      }, timeoutMs)
    })
  }

  wait<T extends OT>(
    type: T,
    options?: WhenOptions<O> | undefined,
  ): Promise<O & { type: T }> {
    return this.when({
      ...options,
      filter: msg => msg.type === type,
    }) as Promise<O & { type: T }>
  }
}
