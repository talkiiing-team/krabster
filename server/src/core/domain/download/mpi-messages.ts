import { DownloadTask } from './download-task'
import { Download } from './download'
import { IMessagePassingInterface } from '@sovok/server/shared/mpi'
import { Injection } from '@sovok/shared'

export const enum InputMessageKind {
  DownloadTask = 'DownloadTask',
}

/**
 * Message to be sent to a worker
 */
export type InputMessage = {
  type: InputMessageKind.DownloadTask
  payload: DownloadTask
}

export const enum DownloadTaskErrorKind {
  NotFoundTrack = 'NotFoundTrack',
  NotFoundDownload = 'NotFoundDownload',
}

export class DownloadTaskError {
  constructor(
    public readonly type: DownloadTaskErrorKind,
    public readonly context?: unknown,
  ) {}
}

export const enum OutputMessageKind {
  DownloadTaskStart = 'DownloadTaskStart',
  DownloadTaskSuccess = 'DownloadTaskSuccess',
  DownloadTaskError = 'DownloadTaskError',
}

/**
 * Message to be sent by a worker
 */
export type OutputMessage =
  | {
      type: OutputMessageKind.DownloadTaskStart
      payload: { taskId: DownloadTask['id'] }
    }
  | {
      type: OutputMessageKind.DownloadTaskSuccess
      payload: { taskId: DownloadTask['id']; download: Download }
    }
  | {
      type: OutputMessageKind.DownloadTaskError
      payload: { taskId: DownloadTask['id']; error: DownloadTaskError }
    }

export type WorkerMpi = IMessagePassingInterface<InputMessage, OutputMessage>
export type WorkerMpiInjection = Injection<'workerMpi', WorkerMpi>

export type ServerMpi = IMessagePassingInterface<OutputMessage, InputMessage>
export type ServerMpiInjection = Injection<'serverMpi', ServerMpi>
