import type { Buffer } from 'node:buffer';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import * as Minio from 'minio';
import { inject, injectable } from 'tsyringe';

import type { TableId } from '../database';

import { S3ResourcesBucketsRepo } from './repo';
import { S3UploadError } from './s3.errors';

@injectable()
export class S3Service {
  constructor(
    @inject(S3ResourcesBucketsRepo) private readonly s3ResourcesBucketsRepo: S3ResourcesBucketsRepo,
  ) {}

  getBucketS3Access = (bucketId: TableId) => pipe(
    this.s3ResourcesBucketsRepo.findById({
      id: bucketId,
    }),
    TE.map(bucket => ({
      bucket,
      client: new Minio.Client({
        endPoint: bucket.endpoint,
        port: bucket.port,
        useSSL: bucket.ssl,
        accessKey: bucket.accessKeyId,
        secretKey: bucket.secretAccessKey,
      }),
    })),
  );

  uploadFile = (
    {
      bucketId,
      buffer,
      fileName,
    }: {
      bucketId: TableId;
      buffer: Buffer | string;
      fileName: string;
    },
  ) => pipe(
    this.getBucketS3Access(bucketId),
    TE.chainW(({ client, bucket }) => S3UploadError.tryCatch(
      () => client.putObject(bucket.bucketName, fileName, buffer),
    )),
  );
}
