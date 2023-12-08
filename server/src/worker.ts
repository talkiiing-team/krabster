import { S3 } from 'aws-sdk'
import { parentPort } from 'worker_threads'
import { asFunction, asValue, createContainer } from 'awilix'
import { MusicBrainzApi } from 'musicbrainz-api'

import { StrictNameAndRegistrationPair } from '@sovok/shared'

import {
  DownloadTaskError,
  InputMessageKind,
  OutputMessageKind,
  ServerMpi,
  ServerMpiInjection,
} from './core/domain'
import { MessagePassingInterface } from './shared/mpi/worker-mpi'
import {
  DownloadPipelineUseCaseInjection,
  downloadPipelineUseCase,
} from './download-pipeline/application/download-pipeline-use-case'
import {
  PlatformUploadApiInjection,
  YouTubePlatformDownloadApiInjection,
} from './download-pipeline/application'
import { ExternalGetTrackApiInjection } from './core/application'
import {
  MusicBrainzApiInjection,
  externalGetTrackApi,
} from './core/infrastructure'
import { CacheInjection, InMemoryCache } from './shared/cache'
import { S3Injection } from './shared/s3'
import { EnvironmentInjection, getEnvironment } from './shared/environment'
import {
  s3PlatformUploadApi,
  youtubePlatformDownloadApi,
} from './download-pipeline/infrastructure'

const serverMpi: ServerMpi = new MessagePassingInterface(parentPort!)

const musicBrainzApi = new MusicBrainzApi({
  appName: 'node-universal-music',
  appVersion: '0.0.1',
  appContactInfo: 'roamiiing@roamiiing.ru',
})

type WorkerContainer = CacheInjection &
  S3Injection &
  EnvironmentInjection &
  ServerMpiInjection &
  DownloadPipelineUseCaseInjection &
  PlatformUploadApiInjection &
  ExternalGetTrackApiInjection &
  MusicBrainzApiInjection &
  YouTubePlatformDownloadApiInjection

const container = createContainer<WorkerContainer>()

const env = getEnvironment()

const cache = new InMemoryCache()

const s3 = new S3({
  endpoint: env.SOVOK_SERVER_S3_SERVER,
  credentials: {
    accessKeyId: env.SOVOK_SERVER_S3_ACCESS_KEY,
    secretAccessKey: env.SOVOK_SERVER_S3_SECRET_KEY,
  },
  sslEnabled: true,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
})

container.register({
  env: asValue(env),
  s3: asValue(s3),
  cache: asValue(cache),
  serverMpi: asValue(serverMpi),
  downloadPipeline: asFunction(downloadPipelineUseCase).singleton(),
  externalGetTrackApi: asFunction(externalGetTrackApi).singleton(),
  musicBrainzApi: asValue(musicBrainzApi),
  youtubePlatformDownloadApi: asValue(youtubePlatformDownloadApi),
  platformUploadApi: asFunction(s3PlatformUploadApi),
} satisfies StrictNameAndRegistrationPair<WorkerContainer>)

serverMpi.on(InputMessageKind.DownloadTask, async task => {
  try {
    const result = await container.cradle.downloadPipeline(task.payload)

    return serverMpi.send({
      type: OutputMessageKind.DownloadTaskSuccess,
      payload: {
        taskId: task.payload.id,
        download: result,
      },
    })
  } catch (error) {
    if (error instanceof DownloadTaskError) {
      return serverMpi.send({
        type: OutputMessageKind.DownloadTaskError,
        payload: {
          taskId: task.payload.id,
          error,
        },
      })
    }

    throw error
  }
})
