import { Injection } from '@sovok/shared'
import { z } from 'zod'

const Environment = z.object({
  SOVOK_SERVER_PORT: z
    .string()
    .optional()
    .default('3000')
    .refine(v => parseInt(v, 10)),
  SOVOK_DATABASE_URL: z.string(),
  SOVOK_SERVER_JWT_SECRET: z.string(),

  SOVOK_SERVER_S3_SERVER: z.string(),
  SOVOK_SERVER_S3_ENDPOINT: z.string(),
  SOVOK_SERVER_S3_BUCKET: z.string(),
  SOVOK_SERVER_S3_REGION: z.string(),
  SOVOK_SERVER_S3_ACCESS_KEY: z.string(),
  SOVOK_SERVER_S3_SECRET_KEY: z.string(),
  SOVOK_SERVER_S3_FOLDER: z.string().optional().default('sovok__dl'),
})

export type Environment = z.infer<typeof Environment>

export type EnvironmentInjection = Injection<'env', Environment>

export const getEnvironment = () => {
  return Environment.parse(process.env)
}
