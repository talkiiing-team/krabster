import { Prisma } from '@prisma/client'
import { PrismaQueryError } from './error-codes'

export const isPrismaKnownError = (
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError =>
  e instanceof Prisma.PrismaClientKnownRequestError

export const isUniqueConstraintError = (
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError => {
  if (!isPrismaKnownError(e)) {
    return false
  }

  return e.code === PrismaQueryError.UniqueenumraintViolation
}
