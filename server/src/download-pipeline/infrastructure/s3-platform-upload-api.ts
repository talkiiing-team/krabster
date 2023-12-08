import { S3Injection } from '@sovok/server/shared/s3'
import { PlatformUploadApi } from '@sovok/server/download-pipeline/application'
import { EnvironmentInjection } from '@sovok/server/shared/environment'

type S3PlatformApiDeps = S3Injection & EnvironmentInjection

export const s3PlatformUploadApi =
  ({ s3, env }: S3PlatformApiDeps): PlatformUploadApi =>
  async (stream, uploadId, format) => {
    const uploadPath = `${env.SOVOK_SERVER_S3_FOLDER}/${uploadId}.${format}`

    await s3
      .upload({
        Bucket: env.SOVOK_SERVER_S3_BUCKET,
        Key: uploadPath,
        Body: stream,
        ACL: 'public-read',
      })
      .promise()
  }
