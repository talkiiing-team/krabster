import { Injection } from '@sovok/shared'
import { S3 } from 'aws-sdk'

export type S3Injection = Injection<'s3', S3>
