import { MusicBrainzApi } from 'musicbrainz-api'
import { Worker } from 'worker_threads'
import { StrictNameAndRegistrationPair } from '@sovok/shared'
import {
  asClass,
  asFunction,
  asValue,
  createContainer as newContainer,
} from 'awilix'
import {
  DownloadService,
  DownloadServiceInjection,
  DownloadTasksRepositoryInjection,
  ExternalSearchApiInjection,
  GetDownloadInjection,
  InsertDownloadInjection,
  SearchUseCaseInjection,
  searchUseCase,
} from './core/application'
import {
  DownloadTasksRepositoryImpl,
  externalSearchApi,
  getDownload,
  insertDownload,
} from './core/infrastructure'
import { MusicBrainzApiInjection } from './core/infrastructure'
import { CacheInjection, InMemoryCache } from './shared/cache'
import { WorkerMpi, WorkerMpiInjection } from './core/domain'
import { MessagePassingInterface } from './shared/mpi/worker-mpi'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaInjection } from './shared/prisma'
import { EnvironmentInjection, getEnvironment } from './shared/environment'

export type AppContainer = EnvironmentInjection &
  CacheInjection &
  PrismaInjection &
  MusicBrainzApiInjection &
  SearchUseCaseInjection &
  ExternalSearchApiInjection &
  DownloadServiceInjection &
  DownloadTasksRepositoryInjection &
  GetDownloadInjection &
  InsertDownloadInjection &
  WorkerMpiInjection

export const createContainer = (): AppContainer => {
  const env = getEnvironment()

  const cache = new InMemoryCache()
  const prisma = new PrismaClient()

  const musicBrainzApi = new MusicBrainzApi({
    appName: 'node-universal-music',
    appVersion: '0.0.1',
    appContactInfo: 'roamiiing@roamiiing.ru',
  })

  const worker = new Worker(path.resolve(__dirname, 'worker.ts'))
  const workerMpi: WorkerMpi = new MessagePassingInterface(worker)

  const container = newContainer<AppContainer>()

  container.register({
    env: asValue(env),

    cache: asValue(cache),
    prisma: asValue(prisma),

    musicBrainzApi: asValue(musicBrainzApi),
    externalSearchApi: asFunction(externalSearchApi).singleton(),

    searchUseCase: asFunction(searchUseCase).singleton(),

    downloadService: asClass(DownloadService).singleton(),
    workerMpi: asValue(workerMpi),
    getDownload: asFunction(getDownload).singleton(),
    insertDownload: asFunction(insertDownload).singleton(),

    downloadTasksRepository: asClass(DownloadTasksRepositoryImpl).singleton(),
  } satisfies StrictNameAndRegistrationPair<AppContainer>)

  return container.cradle
}
