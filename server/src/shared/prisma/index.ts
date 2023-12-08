import { PrismaClient } from '@prisma/client'
import { Injection } from '@sovok/shared'

export * from './error-codes'
export * from './error-guards'

export type PrismaInjection = Injection<'prisma', PrismaClient>
